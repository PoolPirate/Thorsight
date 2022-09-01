namespace Thorsight.Models.Dtos;

public class OpenPositionDto
{
    public DateTimeOffset Timestamp { get; private set; }
    public string PoolName { get; private set; }
    public ulong CurrentStakeUnits { get; private set; }
    public decimal TotalStakeUnits { get; private set; }

    public decimal ValueUSD { get; private set; }

    public decimal AssetAmount { get; private set; }
    public decimal RuneAmount { get; private set; }

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
