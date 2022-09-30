import { Component } from "@angular/core";
import { BaseComponent } from "../../../../../shared/component/base.component";
import { ProfitabilityCacheService } from "../../services/profitability-cache.service";

@Component({
  selector: 'systemincome-page',
  templateUrl: './systemincome.page.html',
  styleUrls: ['./systemincome.page.scss']
})
export class SystemIncomePage extends BaseComponent {
  constructor(private cache: ProfitabilityCacheService) {
    super();
  }

  get incomeReady() {
    return this.cache.systemStatisticsHistory != null;
  }

  get trackedDays() {
    return this.cache.dayCount;
  }

  get totalEarnings() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.blockRewards + x.liquidityFee);
    return Math.round(100 * total) / 100;
  }
  get totalEarningsUSD() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += (x.blockRewards + x.liquidityFee) * x.runeUSD);
    return Math.round(100 * total) / 100;
  }

  get totalBlockRewards() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.blockRewards);
    return Math.round(100 * total) / 100;
  }
  get totalBlockRewardsUSD() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.blockRewards * x.runeUSD);
    return Math.round(100 * total) / 100;
  }

  get totalLiquidityFees() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.liquidityFee);
    return Math.round(100 * total) / 100;
  }
  get totalLiquidityFeesUSD() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.liquidityFee * x.runeUSD);
    return Math.round(100 * total) / 100;
  }

  get totalSwapVolume() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.swapVolume);
    return Math.round(100 * total) / 100;
  }
  get totalSwapVolumeUSD() {
    var total = 0;
    this.cache.systemStatisticsHistory?.forEach(x => total += x.swapVolume * x.runeUSD);
    return Math.round(100 * total) / 100;
  }

  get totalOffsetSwapVolume() {
    return this.totalSwapVolume +
      this.totalSwapVolume * (this.totalBlockRewards / this.totalLiquidityFees);
  }
  get totalOffsetSwapVolumeUSD() {
    return this.totalSwapVolumeUSD +
      this.totalSwapVolumeUSD * (this.totalBlockRewards / this.totalLiquidityFees);
  }

  get averageFeePercentage() {
    return 100 * (Math.round(1000000 * this.totalLiquidityFees / this.totalSwapVolume) / 1000000);
  }

  get offsetIncreasePercentage() {
    return 100 * (Math.round(1000000 * this.totalOffsetSwapVolume / this.totalSwapVolume) / 1000000) 
  }
}
