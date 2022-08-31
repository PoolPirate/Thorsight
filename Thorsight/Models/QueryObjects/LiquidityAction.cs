using System.Globalization;

namespace Thorsight.Models.QueryObjects;

public class LiquidityAction : FlipsideObject
{
    public DateTimeOffset BlockTimestamp { get; private set; }
    public string Action { get; private set; } = null!;
    public string PoolName { get; private set; } = null!;

    public decimal PricePerUnit { get; private set; }
    public ulong Units { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        BlockTimestamp = DateTimeOffset.Parse(rawValues[0]);
        Action = rawValues[1];
        PoolName = rawValues[2];

        PricePerUnit = decimal.Parse(rawValues[3], NumberStyles.Float);
        Units = ulong.Parse(rawValues[4]);
    }
}
