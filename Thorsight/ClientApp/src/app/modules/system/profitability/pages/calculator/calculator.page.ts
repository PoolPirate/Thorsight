import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { first } from "rxjs";
import { FirstValueFromConfig } from "rxjs/internal/firstValueFrom";
import { BaseComponent } from "../../../../../shared/component/base.component";
import { ProfitabilityCacheService } from "../../services/profitability-cache.service";
import { BlockRewardsGraph } from "./components/block-rewards-graph/block-rewards.graph";
import { ReserveBalanceGraph } from "./components/reserve-balance-graph/reserve-balance.graph";
import { SwapVolumeProjectionGraph } from "./components/swap-volume-graph/swap-volume.graph";
import { SystemIncomeGraph } from "./components/system-income-graph/system-income.graph";

@Component({
  selector: 'calculator-page',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss']
})
export class ProfitabilityCalculatorPage extends BaseComponent implements OnInit {
  @ViewChild(ReserveBalanceGraph)
  reserveBalanceGraph: ReserveBalanceGraph = null!;
  @ViewChild(BlockRewardsGraph)
  blockRewardsGraph: BlockRewardsGraph = null!;
  @ViewChild(SwapVolumeProjectionGraph)
  swapVolumeGraph: SwapVolumeProjectionGraph = null!;
  @ViewChild(SystemIncomeGraph)
  systemIncomeGraph: SystemIncomeGraph = null!;

  yearsTimeFrameForm: FormControl = new FormControl("-");

  emissionCurveForm: FormControl = new FormControl("-");

  reserveBalanceForm: FormControl = new FormControl("-");
  reserveIncomeForm: FormControl = new FormControl("-");
  reserveIncomeChangeForm: FormControl = new FormControl("-");

  swapVolumeForm: FormControl = new FormControl("-");
  feePerVolumeForm: FormControl = new FormControl("-");
  volumeChangeForm: FormControl = new FormControl("-");

  get yearsTimeFrame(): number { return this.yearsTimeFrameForm.value }
  set yearsTimeFrame(value: number) { this.yearsTimeFrameForm.setValue(value) }

  get emissionCurve(): number { return this.emissionCurveForm.value }
  set emissionCurve(value: number) { this.emissionCurveForm.setValue(Math.round(100 * value) / 100) }

  get reserveBalance(): number { return this.reserveBalanceForm.value }
  set reserveBalance(value: number) { this.reserveBalanceForm.setValue(Math.round(100000 * value) / 100000) }

  get reserveIncome(): number { return this.reserveIncomeForm.value }
  set reserveIncome(value: number) { this.reserveIncomeForm.setValue(Math.round(100000 * value) / 100000) }

  get reserveIncomeChange(): number { return 1 + this.reserveIncomeChangeForm.value / 100 }
  set reserveIncomeChange(value: number) { this.reserveIncomeChangeForm.setValue(Math.round(100000 * 100 * (value - 1)) / 100000) }

  get swapVolume(): number { return this.swapVolumeForm.value }
  set swapVolume(value: number) { this.swapVolumeForm.setValue(Math.round(100000 * value) / 100000) }

  get feePerVolume(): number { return this.feePerVolumeForm.value / 100 }
  set feePerVolume(value: number) { this.feePerVolumeForm.setValue(Math.round(100000 * 100 * value) / 100000) }

  get volumeChange(): number { return this.volumeChangeForm.value / 100 }
  set volumeChange(value: number) { this.volumeChangeForm.setValue(Math.round(100000 * 100 * value) / 100000) }

  constructor(private cache: ProfitabilityCacheService, private changeTracker: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {
    if (this.cache.complete) {
      this.reset();
      return;
    }

    this.cache.onContentUpdated.pipe(first()).subscribe(() => {
      this.reset();
    });
  }

  reset() {
    this.yearsTimeFrame = 10;

    this.emissionCurve = 6;
    this.reserveBalance = 500000000 * 0.44;
    this.reserveIncome = 0.2;
    this.reserveIncomeChange = 1.1;

    this.feePerVolume = this.totalLiquidityFee / this.totalSwapVolume;
    this.swapVolume = this.totalSwapVolume / (this.cache.dayCount * 24 * 60 * 60 / 5);
    this.volumeChange = 1.1;

    this.changeTracker.detectChanges();

    this.generateGraph();
  }

  generateGraph() {
    this.reserveBalanceGraph.generateCharts();
    this.blockRewardsGraph.generateCharts();
    this.swapVolumeGraph.generateCharts();
    this.systemIncomeGraph.generateCharts();
  }

  get totalLiquidityFee() {
    return this.cache.systemStatisticsHistory!.reduce<number>((last, curr, i, arr) => last + curr.liquidityFee, 0);
  }
  get totalSwapVolume() {
    return this.cache.systemStatisticsHistory!.reduce<number>((last, curr, i, arr) => last + curr.swapVolume, 0);
  }

}
