namespace Thorsight.Models.Dtos;

public class LiquidityActionDto
{
    public DateTime BlockTimestamp { get; }
    public string Action { get; }
    public string PoolName { get; }

    public decimal PricePerUnit { get; }
    public ulong Units { get; }

    public LiquidityActionDto(DateTime blockTimestamp, string action, string poolName, decimal pricePerUnit, ulong units)
    {
        BlockTimestamp = blockTimestamp;
        Action = action;
        PoolName = poolName;
        PricePerUnit = pricePerUnit;
        Units = units;
    }
}
