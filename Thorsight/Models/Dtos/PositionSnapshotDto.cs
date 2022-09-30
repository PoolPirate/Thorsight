namespace Thorsight.Models.Dtos;

public class PositionSnapshotDto
{
    public DateTime Timestamp { get; private set; }
    public string PoolName { get; private set; }
    public decimal AssetPrice { get; private set; }

    public long CurrentStakeUnits { get; private set; }
    public decimal TotalStakeUnits { get; private set; }

    public decimal ValueUSD { get; private set; }
    public decimal BreakEvenValue { get; private set; }

    public decimal AssetAmount { get; private set; }
    public decimal RuneAmount { get; private set; }

    public decimal DepositRuneValue { get; private set; }
    public decimal DepositAssetValue { get; private set; }

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
