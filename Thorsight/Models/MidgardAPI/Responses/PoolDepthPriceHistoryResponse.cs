namespace Thorsight.Models.MidgardAPI.Responses;

public class PoolDepthPriceHistoryResponse
{
    public PoolDepthPriceSnapshot[] Intervals { get; set; } = null!;
}
