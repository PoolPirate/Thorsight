namespace Thorsight.Models.Dtos;

public class PositionSnapshotDto
{
    public DateTime Timestamp { get; }
    public string PoolName { get; }
    public decimal AssetPrice { get; }

    public long CurrentStakeUnits { get; }
    public decimal TotalStakeUnits { get; }

    public decimal ValueUSD { get; }
    public decimal BreakEvenValue { get; }

    public decimal AssetAmount { get; }
    public decimal RuneAmount { get; }

    public decimal DepositRuneValue { get; }
    public decimal DepositAssetValue { get; }

    public PositionSnapshotDto(DateTime timestamp, string poolName, decimal assetPrice, long currentStakeUnits, decimal totalStakeUnits,
        decimal valueUSD, decimal breakEvenPrice, decimal assetAmount, decimal runeAmount, decimal depositRuneValue, decimal depositAssetValue)
    {
        Timestamp = timestamp;
        PoolName = poolName;
        AssetPrice = assetPrice;
        CurrentStakeUnits = currentStakeUnits;
        TotalStakeUnits = totalStakeUnits;
        ValueUSD = valueUSD;
        BreakEvenValue = breakEvenPrice;
        AssetAmount = assetAmount;
        RuneAmount = runeAmount;
        DepositRuneValue = depositRuneValue;
        DepositAssetValue = depositAssetValue;
    }

    private PositionSnapshotDto(string poolName, long currentStakeUnits, decimal breakEvenPrice, decimal depositRuneAmount, decimal depositAssetAmount)
    {
        PoolName = poolName;
        CurrentStakeUnits = currentStakeUnits;
        BreakEvenValue = breakEvenPrice;
        DepositRuneValue = depositRuneAmount;
        DepositAssetValue = depositAssetAmount;
    }

    public static PositionSnapshotDto Initial(string poolName, long currentStakeUnits, decimal breakEvenPrice, decimal depositRuneAmount, decimal depositAssetAmount)
        => new PositionSnapshotDto(poolName, currentStakeUnits, breakEvenPrice, depositRuneAmount, depositAssetAmount);
}
