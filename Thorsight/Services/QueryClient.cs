using Common.Services;
using Thorsight.Models.Dtos;
using Thorsight.Models.QueryObjects;

namespace Thorsight.Services;

public class QueryClient : Singleton
{
    [Inject]
    private readonly FlipsideClient Flipside;
    [Inject]
    private readonly MidgardClient Midgard;

    public async Task<LiquidityActionDto[]> GetLiquidityActionsAsync(string address, CancellationToken cancellationToken)
    {
        string sql =
            "SELECT block_timestamp, lp_action, pool_name, (rune_amount_usd + asset_amount_usd) / stake_units AS price_per_unit, stake_units AS units " +
            "FROM flipside_prod_db.thorchain.liquidity_actions " +
            "WHERE from_address = '" + address + "'";

        var actions = await Flipside.RunQueryAsync<LiquidityAction>(sql, cancellationToken: cancellationToken);
        return actions
            .Select(x => new LiquidityActionDto(x.BlockTimestamp, x.Action, x.PoolName, x.PricePerUnit, x.Units))
            .ToArray();
    }


    public async Task<OpenPositionDto[]> GetCurrentPositionsAsync(string address, CancellationToken cancellationToken)
    {
        string sql =
            "SELECT CURRENT_TIMESTAMP AS time, pool_name, sum(CASE WHEN LP_ACTION = 'add_liquidity' THEN stake_units ELSE -stake_units END) AS current_stake_units " +
            "FROM flipside_prod_db.thorchain.liquidity_actions " +
            "WHERE from_address = '" + address + "' " +
            "GROUP BY pool_name";

        var positions = await Flipside.RunQueryAsync<OpenPosition>(sql, cancellationToken: cancellationToken);

        var positionDtos = new List<OpenPositionDto>();

        foreach (var position in positions)
        {
            var pool = await Midgard.GetPoolAsync(position.PoolName);

            if (pool is null)
            {
                continue;
            }

            decimal poolShare = (decimal)position.CurrentStakeUnits / pool.Units;

            decimal runeAmount = pool.RuneDepth * poolShare / 100000000;
            decimal assetAmount = runeAmount / pool.AssetPrice;

            decimal valueUSD = 2 * assetAmount * pool.AssetPriceUSD;

            positionDtos.Add(new OpenPositionDto(position.Timestamp, position.PoolName, position.CurrentStakeUnits, pool.Units, valueUSD, assetAmount, runeAmount));
        }

        return positionDtos.ToArray();
    }

    public async Task<PositionSnapshotDto[]> GetPositionHistoryAsync(string address, int days, CancellationToken cancellationToken)
    {
        string sql =
         "SELECT a.block_timestamp, lp_action, a.pool_name, (a.rune_amount_usd + a.asset_amount_usd) / a.stake_units AS price_per_unit, a.stake_units AS units, " +
         "(a.asset_amount / 2) * (b.rune_amount / b.asset_amount) + (a.rune_amount / 2) AS deposit_rune_value, " +
         "(a.rune_amount / 2) * (b.asset_amount / b.rune_amount) + (a.asset_amount / 2) AS deposit_asset_value, " +
         "COALESCE(u.basis_points, 0) AS withdraw_basis_points " +
         "FROM flipside_prod_db.thorchain.liquidity_actions a " +
         "JOIN flipside_prod_db.thorchain.pool_block_balances b ON a.block_id = b.block_id AND a.pool_name = b.pool_name " +
         "LEFT JOIN flipside_prod_db.thorchain.unstake_events u ON a.block_id = u.block_id AND a.tx_id = u.tx_id AND a.pool_name = u.pool_name AND a.to_address = u.to_address AND a.from_address = u.from_address AND a.stake_units = u.stake_units " +
        $"WHERE a.from_address = '{address}'";

        var now = DateTimeOffset.UtcNow;
        var currentDay = now.Subtract(now.TimeOfDay);
        var timeframe = Enumerable.Range(0, days)
            .Select(x => x - days)
            .Select(x => currentDay.AddDays(x))
            .ToArray();

        var liquidityActions = (await Flipside.RunQueryAsync<LiquidityUpdate>(sql, cancellationToken: cancellationToken))
            .OrderBy(x => x.BlockTimestamp)
            .ToArray(); ;

        var poolNames = liquidityActions.Select(x => x.PoolName).Distinct();

        var positionSnapshots = new List<PositionSnapshotDto>();

        foreach (string poolName in poolNames)
        {
            var poolHistory = await Midgard.GetPoolDepthPriceHistory(poolName, days, cancellationToken);

            if (poolHistory is null)
            {
                continue;
            }

            var previousLpActions = liquidityActions
                .Where(x => x.PoolName == poolName && x.BlockTimestamp.Date < timeframe[0].Date)
                .ToArray();

            var initialPosition = PositionSnapshotDto.Initial(poolName,
                    previousLpActions.Sum(x => x.Action == "add_liquidity" ? x.Units : -x.Units),
                    previousLpActions.Sum(x => x.Action == "add_liquidity" ? x.Units * x.PricePerUnit : -x.Units * x.PricePerUnit),
                    previousLpActions.Aggregate<LiquidityUpdate, decimal>(0, (current, update) => update.Action == "add_liquidity" ? current + update.DepositRuneValue : current - (current * update.WithdrawBasisPoints / 10000)),
                    previousLpActions.Aggregate<LiquidityUpdate, decimal>(0, (current, update) => update.Action == "add_liquidity" ? current + update.DepositAssetValue : current - (current * update.WithdrawBasisPoints / 10000))
            );

            foreach (var day in timeframe)
            {
                var currentPoolStats = poolHistory.Where(x => x.StartTime.DateTime == day.DateTime).SingleOrDefault();

                if (currentPoolStats is null)
                {
                    Logger.LogWarning("Missing pool history value: {day} - {poolName}", day.Date.ToShortDateString(), poolName);
                    continue;
                }

                var positionAtStart = positionSnapshots.LastOrDefault(x => x.PoolName == poolName, initialPosition);

                long currentStakeUnits = positionAtStart.CurrentStakeUnits;
                decimal breakEvenValue = positionAtStart.BreakEvenValue;
                decimal depositRuneValue = positionAtStart.DepositRuneValue;
                decimal depositAssetValue = positionAtStart.DepositAssetValue;

                var lpActions = liquidityActions
                    .Where(x => x.PoolName == poolName && x.BlockTimestamp.Date == day.Date);


                foreach (var lpAction in lpActions)
                {
                    if (lpAction.Action == "add_liquidity")
                    {
                        currentStakeUnits += lpAction.Units;
                        breakEvenValue += lpAction.Units * lpAction.PricePerUnit;
                        depositRuneValue += lpAction.DepositRuneValue;
                        depositAssetValue += lpAction.DepositAssetValue;
                    }
                    if (lpAction.Action == "remove_liquidity")
                    {
                        currentStakeUnits -= lpAction.Units;
                        breakEvenValue -= lpAction.Units * lpAction.PricePerUnit;
                        depositRuneValue -= depositRuneValue * lpAction.WithdrawBasisPoints / 10000;
                        depositAssetValue -= depositAssetValue * lpAction.WithdrawBasisPoints / 10000;
                    }
                }

                decimal poolShare = currentPoolStats.Units == 0 ? 0 : (decimal)currentStakeUnits / currentPoolStats.Units;
                decimal runeAmount = currentPoolStats.RuneDepth * poolShare / 100000000;
                decimal assetAmount = currentPoolStats.AssetPrice == 0 ? 0 : runeAmount / currentPoolStats.AssetPrice;

                decimal valueUSD = 2 * assetAmount * currentPoolStats.AssetPriceUSD;

                var positionAtEnd = new PositionSnapshotDto(
                    day, poolName, currentPoolStats.AssetPrice, currentStakeUnits,
                    currentPoolStats.Units, valueUSD, breakEvenValue, assetAmount, runeAmount,
                    depositRuneValue, depositAssetValue);

                positionSnapshots.Add(positionAtEnd);
            }
        }

        return positionSnapshots.ToArray();
    }
}
