using System.Text.Json.Serialization;
using Thorsight.Converters;

namespace Thorsight.Models.MidgardAPI;

public class PoolDepthPriceSnapshot
{
    [JsonConverter(typeof(UnixTimeSecondsDateTimeOffsetConverter))]
    public DateTimeOffset StartTime { get; set; }
    [JsonConverter(typeof(UnixTimeSecondsDateTimeOffsetConverter))]
    public DateTimeOffset EndTime { get; set; }

    public ulong AssetDepth { get; set; }
    public ulong RuneDepth { get; set; }

    public decimal AssetPrice { get; set; }
    public decimal AssetPriceUSD { get; set; }

    public ulong Units { get; set; }
}
