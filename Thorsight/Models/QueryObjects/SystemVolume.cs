using System.Globalization;

namespace Thorsight.Models.QueryObjects;

public class SystemVolume : FlipsideObject
{
    public DateTime Timestamp { get; private set; }

    public decimal SwapVolume { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        Timestamp = DateTime.Parse(rawValues[0]);

        SwapVolume = decimal.Parse(rawValues[1], NumberStyles.Float);
    }
}
