using System.Globalization;

namespace Thorsight.Models.QueryObjects;

public class SystemPerformanceInfo : FlipsideObject
{
    public decimal AverageBlockTime { get; private set; }
    public decimal AverageVolumePerBlock { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        AverageBlockTime = decimal.Parse(rawValues[0], NumberStyles.Float);
        AverageVolumePerBlock = decimal.Parse(rawValues[1], NumberStyles.Float);
    }
}
