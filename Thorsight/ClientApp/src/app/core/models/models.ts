export class LiquidityAction {
  blockTimestamp!: string;
  action!: string;
  poolName!: string;

  pricePerUnit!: number;
  units!: number
}

export class OpenPosition {
  timestamp!: string;
  poolName!: string;
  currentStakeUnits!: number;
  totalStakeUnits!: number;
  valueUSD!: number;
  assetAmount!: number;
  runeAmount!: number;
}

export class PositionSnapshot {
  timestamp!: string;
  poolName!: string;
  assetPrice!: number;
  currentStakeUnits!: number;
  totalStakeUnits!: number;
  breakEvenPrice!: number;
  valueUSD!: number;
  assetAmount!: number;
  runeAmount!: number;
  depositRuneValue!: number;
  depositAssetValue!: number;
}

export class PoolStatistics {
  timestamp!: string;
  poolName!: string;
  runeDepth!: number;
  assetDepth!: number;
  assetPrice!: number;
  units!: number;
}

export class Balance {
  
}
