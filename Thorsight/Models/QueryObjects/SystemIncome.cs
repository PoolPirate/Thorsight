using System.Globalization;

namespace Thorsight.Models.QueryObjects;

public class SystemStatistics : FlipsideObject
{
    public DateTime Timestamp { get; private set;}

    public decimal LiquidityFee { get; private set; }
    public decimal BlockRewards { get; private set; }

    public decimal BondShare { get; private set; }

    public decimal SwapVolume { get; private set; }

    public decimal RuneUSD { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        Timestamp = DateTime.Parse(rawValues[0]);

        SwapVolume = decimal.Parse(rawValues[1], NumberStyles.Float);

        LiquidityFee = decimal.Parse(rawValues[2], NumberStyles.Float);
        BlockRewards = decimal.Parse(rawValues[3], NumberStyles.Float);

        BondShare = decimal.Parse(rawValues[4], NumberStyles.Float);

        RuneUSD  = decimal.Parse(rawValues[5], NumberStyles.Float);
    }
}
