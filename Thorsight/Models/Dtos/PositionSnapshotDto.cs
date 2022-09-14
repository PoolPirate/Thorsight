namespace Thorsight.Models.Dtos;

public class PositionSnapshotDto
{
    public DateTimeOffset Timestamp { get; private set; }
    public string PoolName { get; private set; }
    public decimal AssetPrice { get; private set; }

    public ulong CurrentStakeUnits { get; private set; }
    public decimal TotalStakeUnits { get; private set; }

    public decimal ValueUSD { get; private set; }
    public decimal BreakEvenPrice { get; private set; }

    public decimal AssetAmount { get; private set; }
    public decimal RuneAmount { get; private set; }

    public decimal DepositRuneValue { get; private set; }
    public decimal DepositAssetValue { get; private set; }

    public PositionSnapshotDto(DateTimeOffset timestamp, string poolName, decimal assetPrice, ulong currentStakeUnits, decimal totalStakeUnits,
        decimal valueUSD, decimal breakEvenPrice, decimal assetAmount, decimal runeAmount, decimal depositRuneValue, decimal depositAssetValue)
    {
        Timestamp = timestamp;
        PoolName = poolName;
        AssetPrice = assetPrice;
        CurrentStakeUnits = currentStakeUnits;
        TotalStakeUnits = totalStakeUnits;
        ValueUSD = valueUSD;
        BreakEvenPrice = breakEvenPrice;
        AssetAmount = assetAmount;
        RuneAmount = runeAmount;
        DepositRuneValue = depositRuneValue;
        DepositAssetValue = depositAssetValue;
    }
}
