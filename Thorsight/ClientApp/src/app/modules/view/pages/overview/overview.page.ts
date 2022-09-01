import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { LiquidityAction, OpenPosition } from "../../../../core/models/models";
import { QueryService } from "../../../../core/services/queryservice";
import { ColorUtils } from "../../../../shared/utils/color-utils";
import { ViewCacheService } from "../../services/view-cache.service";

@Component({
  selector: 'overview-page',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss']
})
export class OverviewPage {
  constructor(private viewCache: ViewCacheService) {
  }

  get actions(): LiquidityAction[] {
    return this.viewCache.actions ?? [];
  }

  get openPositions(): OpenPosition[] {
    return this.viewCache.openPositions ?? [];
  }

  get nonRuneAssets(): Asset[] {
    const list: Asset[] = [];
    this.openPositions.forEach(x => {
      const asset: Asset = {
        name: x.poolName,
        displayName: x.poolName.split(".")[1].split("-")[0],
        amount: Math.round(100 * x.assetAmount) / 100,
        value: Math.round(100 * x.valueUSD / 2) / 100
      }
      list.push(asset);
    });
    return list;
  }

  get runeAsset(): Asset {
    var totalRune: number = 0;
    var totalValue: number = 0;
    this.openPositions.forEach(x => {
      totalRune += x.runeAmount;
      totalValue += x.valueUSD / 2;
    });
    return { name: "THOR.RUNE", displayName: "RUNE", amount: Math.round(100 * totalRune) / 100, value: Math.round(100 * totalValue) / 100 };
  }

  get totalDeposited() {
    var totalDeposit: number = 0;
    this.actions.filter(x => x.action == "add_liquidity").forEach(x => totalDeposit += x.pricePerUnit * x.units);
    return Math.round(100 * totalDeposit) / 100;
  }

  get totalWithdrawn() {
    var totalWithdrawn: number = 0;
    this.actions.filter(x => x.action == "remove_liquidity").forEach(x => totalWithdrawn += x.pricePerUnit * x.units);
    return Math.round(100 * totalWithdrawn) / 100;
  }

  get totalCurrent() {
    var totalCurrent: number = 0;
    this.openPositions.forEach(x => totalCurrent += x.valueUSD);
    return Math.round(100 * totalCurrent) / 100;
  }

  get totalGainLoss() {
    return Math.round(100 * (this.totalWithdrawn + this.totalCurrent - this.totalDeposited)) / 100;
  }

  getAssetColor(asset: string) {
    return ColorUtils.getAssetColor(asset);
  }
}

interface Asset {
  name: string;
  displayName: string;
  amount: number;
  value: number;
}
