namespace Thorsight.Models.Dtos;

public class LiquidityActionDto
{
    public DateTimeOffset BlockTimestamp { get; private set; }
    public string Action { get; private set; }
    public string PoolName { get; private set; }

    public decimal PricePerUnit { get; private set; }
    public ulong Units { get; private set; }

    public LiquidityActionDto(DateTimeOffset blockTimestamp, string action, string poolName, decimal pricePerUnit, ulong units)
    {
        BlockTimestamp = blockTimestamp;
        Action = action;
        PoolName = poolName;
        PricePerUnit = pricePerUnit;
        Units = units;
    }
}
