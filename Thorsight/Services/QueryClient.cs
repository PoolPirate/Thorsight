using Common.Services;
using System.Runtime.CompilerServices;
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


    public async IAsyncEnumerable<OpenPositionDto> GetOpenPositionsAsync(string address, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        string sql =
            "SELECT pool_name, sum(CASE WHEN LP_ACTION = 'add_liquidity' THEN stake_units ELSE -stake_units END) AS current_stake_units " +
            "FROM flipside_prod_db.thorchain.liquidity_actions " +
            "WHERE from_address = '" + address + "' " +
            "GROUP BY pool_name";

        var positions = await Flipside.RunQueryAsync<OpenPosition>(sql, cancellationToken: cancellationToken);

        foreach(var position in positions)
        {
            var pool = await Midgard.GetPoolAsync(position.PoolName);

            if (pool is null)
            {
                continue;
            }

            decimal poolShare = (decimal) position.CurrentStakeUnits / pool.Units;

            decimal runeAmount = pool.RuneDepth * poolShare / 100000000;
            decimal assetAmount = runeAmount / pool.AssetPrice;

            decimal valueUSD = 2 * assetAmount * pool.AssetPriceUSD;

            yield return new OpenPositionDto(position.PoolName, position.CurrentStakeUnits, valueUSD, assetAmount, runeAmount);
        }
    }
}
