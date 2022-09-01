namespace Thorsight.Models.QueryObjects;

public class PoolStatistics : FlipsideObject
{
    public DateTimeOffset Timestamp { get; private set; }
    public string PoolName { get; private set; } = null!;

    public decimal RuneDepth { get; private set; }
    public decimal AssetDepth { get; private set; }
    public ulong Units { get; private set; }

    public decimal AssetPrice { get; private set; }
    public decimal AssetPriceUSD { get; private set; }
    
    public override void SetValues(string[] rawValues)
    {
        Timestamp = DateTimeOffset.Parse(rawValues[0]);
        PoolName = rawValues[1];
        RuneDepth = decimal.Parse(rawValues[2]);
        AssetDepth = decimal.Parse(rawValues[3]);
        Units = ulong.Parse(rawValues[4]);
        AssetPrice = decimal.Parse(rawValues[5]);
        AssetPriceUSD = decimal.Parse(rawValues[6]);
    }
}
