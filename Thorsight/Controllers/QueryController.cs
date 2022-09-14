using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Thorsight.Models.Dtos;
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
    public async Task<IEnumerable<LiquidityActionDto>> GetLiquidityActionsAsync([FromRoute] string address,
        CancellationToken cancellationToken)
        => (await QueryClient.GetLiquidityActionsAsync(address, cancellationToken))
            .OrderBy(x => x.BlockTimestamp)
            .ThenBy(x => x.PoolName);

    [HttpGet("LiquidityPositions/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<IEnumerable<OpenPositionDto>> GetOpenPositionsAsync([FromRoute] string address,
        CancellationToken cancellationToken)
        => (await QueryClient.GetCurrentPositionsAsync(address, cancellationToken))
            .OrderBy(x => x.PoolName);

    [HttpGet("PositionHistory/{address}")]
    [ResponseCache(Duration = 120, Location = ResponseCacheLocation.Any)]
    public async Task<IEnumerable<PositionSnapshotDto>> GetPositionHistoryAsync([FromRoute] string address, [FromQuery][Range(7, 180)] int days,
        CancellationToken cancellationToken)
        => (await QueryClient.GetPositionHistoryAsync(address, days, cancellationToken))
            .OrderBy(x => x.Timestamp)
            .ThenBy(x => x.PoolName);
}
