namespace Thorsight.Models.Dtos;

public class OpenPositionDto
{
    public string PoolName { get; private set; }
    public ulong CurrentStakeUnits { get; private set; }
    public decimal TotalStakeUnits { get; private set; }

    public decimal ValueUSD { get; private set; }

    public decimal AssetAmount { get; private set; }
    public decimal RuneAmount { get; private set; }

    public OpenPositionDto(string poolName, ulong currentStakeUnits, decimal valueUSD, 
        decimal assetAmount, decimal runeAmount)
    {
        PoolName = poolName;
        CurrentStakeUnits = currentStakeUnits;
        ValueUSD = valueUSD;
        AssetAmount = assetAmount;
        RuneAmount = runeAmount;
    }
}
