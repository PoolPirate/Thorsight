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
    public IAsyncEnumerable<OpenPositionDto> GetOpenPositionsAsync(string address, CancellationToken cancellationToken)
        => QueryClient.GetOpenPositionsAsync(address, cancellationToken);
}
