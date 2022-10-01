export class SystemPerformance {
  averageBlockTime!: number;
  averageVolumePerBlock!: number;
}

export class SystemStatistics {
  timestamp!: string;

  liquidityFee!: number;
  blockRewards!: number;

  lpEarnings!: number;
  bondEarnings!: number;

  swapVolume!: number;

  runeUSD!: number;
}

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
  breakEvenValue!: number;
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
