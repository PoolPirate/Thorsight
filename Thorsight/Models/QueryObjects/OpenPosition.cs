namespace Thorsight.Models.QueryObjects;

public class OpenPosition : FlipsideObject
{
    public string PoolName { get; private set; } = null!;
    public ulong CurrentStakeUnits { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        PoolName = rawValues[0];
        CurrentStakeUnits = ulong.Parse(rawValues[1]);
    }
}
