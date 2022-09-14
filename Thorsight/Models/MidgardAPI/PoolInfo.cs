namespace Thorsight.Models.MidgardAPI;

public class PoolInfo
{
    public string Asset { get; set; } = null!;

    public ulong AssetDepth { get; set; }
    public ulong RuneDepth { get; set; }

    //Compared to RUNE
    public decimal AssetPrice { get; set; }
    public decimal AssetPriceUSD { get; set; }

    public ulong Units { get; set; }
}
