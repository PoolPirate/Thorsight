using Common.Services;
using System.Runtime.CompilerServices;
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

    public async Task<PoolStatisticsDto[]> GetDailyPoolStatsAsync(CancellationToken cancellationToken)
    {
        string sql =
            "SELECT day, asset, rune_depth, asset_depth, total_stake, asset_price, asset_price_usd " +
            "FROM flipside_prod_db.thorchain.pool_block_statistics " +
            "WHERE day > CURRENT_DATE - 30";

        var poolStatistics = await Flipside.RunQueryAsync<PoolStatistics>(sql, cancellationToken: cancellationToken);
        return poolStatistics.Select(x => new PoolStatisticsDto(x.Timestamp, x.PoolName, x.RuneDepth, x.AssetDepth, x.Units, x.AssetPrice, x.AssetPriceUSD)).ToArray();
    }

    public async Task<OpenPositionDto[]> GetPositionHistoryAsync(string address, CancellationToken cancellationToken)
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
            "WHERE date_day > CURRENT_DATE - 30 AND date_day < CURRENT_DATE ) " +
            "SELECT day, p.pool_name, COALESCE((SELECT sum(CASE WHEN LP_ACTION = 'add_liquidity' THEN units ELSE -units END) FROM lp_actions a WHERE block_timestamp <= day AND a.pool_name = p.pool_name), 0) AS current_stake_units " +
            "FROM days JOIN pools p";

        var positionHistory = await Flipside.RunQueryAsync<OpenPosition>(sql, cancellationToken: cancellationToken);
        var poolStats = await GetDailyPoolStatsAsync(cancellationToken);

        var pools = new Dictionary<string, PoolInfo?>();
        var positionDtos = new List<OpenPositionDto>();

        foreach (var position in positionHistory)
        {
            var pool = poolStats.FirstOrDefault(x => x.PoolName == position.PoolName && x.Timestamp == position.Timestamp);

            var k = poolStats.Where(x => x.PoolName == position.PoolName).ToArray();
            var k2 = poolStats.Where(x => x.Timestamp == position.Timestamp).ToArray();

            if (pool == null)
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
}
