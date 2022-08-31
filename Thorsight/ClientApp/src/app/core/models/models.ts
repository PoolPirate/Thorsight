export class LiquidityAction {
  blockTimestamp!: Date;
  action!: string;
  poolName!: string;

  pricePerUnit!: number;
  units!: number
}

export class OpenPosition {
  poolName!: string;
  currentStakeUnits!: number;
  totalStakeUnits!: number;
  valueUSD!: number;
  assetAmount!: number;
  runeAmount!: number;
}
