namespace Thorsight.Models.QueryObjects;

public class OpenPosition : FlipsideObject
{
    public DateTimeOffset Timestamp { get; private set; }
    public string PoolName { get; private set; } = null!;
    public ulong CurrentStakeUnits { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        Timestamp = DateTimeOffset.Parse(rawValues[0]);
        PoolName = rawValues[1];
        CurrentStakeUnits = ulong.Parse(rawValues[2]);
    }
}
