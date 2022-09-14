using System.Globalization;

namespace Thorsight.Models.QueryObjects;

public class LiquidityUpdate : FlipsideObject
{
    public DateTimeOffset BlockTimestamp { get; private set; }
    public string Action { get; private set; } = null!;
    public string PoolName { get; private set; } = null!;

    public decimal PricePerUnit { get; private set; }
    public long Units { get; private set; }

    public decimal DepositRuneValue { get; private set; }
    public decimal DepositAssetValue { get; private set; }

    public long WithdrawBasisPoints { get; private set; }

    public override void SetValues(string[] rawValues)
    {
        BlockTimestamp = DateTimeOffset.Parse(rawValues[0]);
        Action = rawValues[1];
        PoolName = rawValues[2];

        PricePerUnit = decimal.Parse(rawValues[3], NumberStyles.Float);
        Units = long.Parse(rawValues[4]);

        DepositRuneValue = decimal.Parse(rawValues[5], NumberStyles.Float);
        DepositAssetValue = decimal.Parse(rawValues[6], NumberStyles.Float);

        WithdrawBasisPoints = long.Parse(rawValues[7]);
    }
}
