namespace Thorsight.Models.Dtos;

public class PoolStatisticsDto
{
    public DateTimeOffset Timestamp { get; }
    public string PoolName { get; } 

    public decimal RuneDepth { get; }
    public decimal AssetDepth { get; }
    public ulong Units { get; }

    public decimal AssetPrice { get; }
    public decimal AssetPriceUSD { get; }

    public PoolStatisticsDto(DateTimeOffset timestamp, string poolName, decimal runeDepth, decimal assetDepth, ulong units, 
        decimal assetPrice, decimal assetPriceUSD)
    {
        Timestamp = timestamp;
        PoolName = poolName;
        RuneDepth = runeDepth;
        AssetDepth = assetDepth;
        Units = units;
        AssetPrice = assetPrice;
        AssetPriceUSD = assetPriceUSD;
    }
}
