using Common.Services;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Thorsight.Models.Dtos;
using Thorsight.Models.MidgardAPI;
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

    public async Task<PositionSnapshotDto[]> GetPositionHistoryAsync(string address, uint days, CancellationToken cancellationToken)
    {
        string sql =
            "WITH lp_actions AS ( " +
            "SELECT block_timestamp, lp_action, pool_name, (rune_amount_usd + asset_amount_usd) / stake_units AS price_per_unit, stake_units AS units " +
            "FROM flipside_prod_db.thorchain.liquidity_actions " +
           $"WHERE from_address = '{address}' ), " +
            "pools AS ( " +
            "SELECT DISTINCT pool_name " +
            "FROM lp_actions )," +
            "days AS ( " +
            "SELECT date_day AS day " +
            "FROM crosschain.core.dim_dates " +
           $"WHERE date_day > CURRENT_DATE - {days + 1} AND date_day < CURRENT_DATE ) " +
            "SELECT day, p.pool_name, " +
            "COALESCE((SELECT sum(CASE WHEN LP_ACTION = 'add_liquidity' THEN units ELSE -units END) FROM lp_actions a WHERE block_timestamp <= day AND a.pool_name = p.pool_name), 0) AS current_stake_units, " +
            "CASE WHEN current_stake_units = 0 THEN 0 ELSE COALESCE((SELECT sum(CASE WHEN LP_ACTION = 'add_liquidity' THEN units * price_per_unit ELSE -units * price_per_unit END) FROM lp_actions a WHERE block_timestamp <= day AND a.pool_name = p.pool_name), 0) / current_stake_units END AS break_even_price_per_unit " +
            "FROM days JOIN pools p";

        var positionHistory = await Flipside.RunQueryAsync<PositionSnapshot>(sql, cancellationToken: cancellationToken);

        var pools = new Dictionary<string, PoolInfo?>();
        var positionDtos = new List<PositionSnapshotDto>();


        foreach(var poolTypeGrouping in positionHistory.GroupBy(x => x.PoolName))
        {
            string poolName = poolTypeGrouping.Key;  
            var poolHistory = await Midgard.GetPoolDepthPriceHistory(poolName, days);

            if (poolHistory is null)
            {
                continue;
            }

            foreach(var position in poolTypeGrouping)
            {
                var poolBalance = poolHistory.FirstOrDefault(x => x.StartTime.DateTime == position.Timestamp.DateTime);

                if (poolBalance is null)
                {
                    Logger.LogWarning("Missing pool history value!");
                    continue;
                }

                decimal poolShare = (decimal)position.CurrentStakeUnits / poolBalance.Units;

                decimal runeAmount = poolBalance.RuneDepth * poolShare / 100000000;
                decimal assetAmount = runeAmount / poolBalance.AssetPrice;

                decimal valueUSD = 2 * assetAmount * poolBalance.AssetPriceUSD;

                var dto = new PositionSnapshotDto(position.Timestamp, position.PoolName, position.CurrentStakeUnits, poolBalance.Units, 
                    valueUSD, position.BreakEvenPrice, assetAmount, runeAmount);
                positionDtos.Add(dto);
            }
        }

        return positionDtos.ToArray();
    }
}
