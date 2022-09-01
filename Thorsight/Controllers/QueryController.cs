using Microsoft.AspNetCore.Mvc;
using Thorsight.Models.Dtos;
using Thorsight.Models.QueryObjects;
using Thorsight.Services;

namespace Thorsight.Controllers;
[Route("Api")]
[ApiController]
public class QueryController : ControllerBase
{
    private readonly QueryClient QueryClient;

    public QueryController(QueryClient queryClient)
    {
        QueryClient = queryClient;
    }

    [HttpGet("LiquidityActions/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<LiquidityActionDto[]> GetLiquidityActionsAsync(string address, CancellationToken cancellationToken)
    {
        var liquidityActions = await QueryClient.GetLiquidityActionsAsync(address, cancellationToken);
        return liquidityActions.OrderBy(x => x.BlockTimestamp).ToArray();
    }

    [HttpGet("LiquidityPositions/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public Task<OpenPositionDto[]> GetOpenPositionsAsync(string address, CancellationToken cancellationToken)
        => QueryClient.GetCurrentPositionsAsync(address, cancellationToken);

    [HttpGet("DailyPoolStats")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<object> GetDailyPoolStatsAsync(CancellationToken cancellationToken)
    {
        var poolStatisticsDtos = await QueryClient.GetDailyPoolStatsAsync(cancellationToken);
        return poolStatisticsDtos.OrderBy(x => x.Timestamp).ToArray();
    }

    [HttpGet("PositionHistory/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<OpenPositionDto[]> GetPositionHistoryAsync(string address, CancellationToken cancellationToken)
        => (await QueryClient.GetPositionHistoryAsync(address, cancellationToken)).OrderBy(x => x.Timestamp).ToArray();
}
