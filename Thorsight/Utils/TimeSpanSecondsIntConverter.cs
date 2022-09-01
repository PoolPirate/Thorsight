using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Thorsight.Converters;

public sealed class UnixTimeSecondsDateTimeOffsetConverter : JsonConverter<DateTimeOffset>
{
    public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        long seconds = reader.TokenType == JsonTokenType.Number
            ? reader.GetInt64()
            : long.Parse(reader.GetString() ?? "0");
        return DateTimeOffset.FromUnixTimeSeconds(seconds);
    }

    public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
    {
        long seconds = value.ToUnixTimeSeconds();
        writer.WriteNumberValue(seconds);
    }
}
