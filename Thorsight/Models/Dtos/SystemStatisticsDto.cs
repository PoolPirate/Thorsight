namespace Thorsight.Models.Dtos;

public class SystemStatisticsDto
{
    public DateTime Timestamp { get; }

    public decimal LiquidityFee { get; }
    public decimal BlockRewards { get; }

    public decimal LpEarnings { get; }
    public decimal BondEarnings { get; }

    public decimal SwapVolume { get; }

    public decimal RuneUSD { get; }

    public SystemStatisticsDto(DateTime timestamp, decimal liquidityFee, decimal blockRewards, 
        decimal bondShare, decimal swapVolume, decimal runeUsd)
    {
        Timestamp = timestamp;
        LiquidityFee = liquidityFee;
        BlockRewards = blockRewards;

        decimal earnings = LiquidityFee + BlockRewards;

        BondEarnings = earnings * bondShare;
        LpEarnings = earnings - BondEarnings;
        SwapVolume = swapVolume;
        RuneUSD = runeUsd;
    }
}
