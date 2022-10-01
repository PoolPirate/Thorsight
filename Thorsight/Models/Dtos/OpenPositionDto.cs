namespace Thorsight.Models.Dtos;

public class OpenPositionDto
{
    public DateTimeOffset Timestamp { get; }
    public string PoolName { get; }
    public ulong CurrentStakeUnits { get; }
    public decimal TotalStakeUnits { get; }

    public decimal ValueUSD { get; }

    public decimal AssetAmount { get; }
    public decimal RuneAmount { get; }

    public OpenPositionDto(DateTimeOffset timestamp, string poolName, ulong currentStakeUnits, ulong totalStakeUnits, decimal valueUSD,
        decimal assetAmount, decimal runeAmount)
    {
        Timestamp = timestamp;
        PoolName = poolName;
        CurrentStakeUnits = currentStakeUnits;
        TotalStakeUnits = totalStakeUnits;
        ValueUSD = valueUSD;
        AssetAmount = assetAmount;
        RuneAmount = runeAmount;
    }
}
