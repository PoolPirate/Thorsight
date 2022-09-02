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
    public async Task<IEnumerable<LiquidityActionDto>> GetLiquidityActionsAsync(string address, CancellationToken cancellationToken)
        => (await QueryClient.GetLiquidityActionsAsync(address, cancellationToken))
            .OrderBy(x => x.BlockTimestamp)
            .ThenBy(x => x.PoolName);

    [HttpGet("LiquidityPositions/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<IEnumerable<OpenPositionDto>> GetOpenPositionsAsync(string address, CancellationToken cancellationToken)
        => (await QueryClient.GetCurrentPositionsAsync(address, cancellationToken))
            .OrderBy(x => x.PoolName);

    [HttpGet("PositionHistory/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<IEnumerable<PositionSnapshotDto>> GetPositionHistoryAsync(string address, CancellationToken cancellationToken)
        => (await QueryClient.GetPositionHistoryAsync(address, cancellationToken))
            .OrderBy(x => x.Timestamp)
            .ThenBy(x => x.PoolName);
}
