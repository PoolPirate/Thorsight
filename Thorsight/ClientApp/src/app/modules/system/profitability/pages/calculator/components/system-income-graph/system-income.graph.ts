import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BaseComponent } from "../../../../../../../shared/component/base.component";

@Component({
  selector: 'system-income-graph',
  templateUrl: './system-income.graph.html',
  styleUrls: ['./system-income.graph.scss'],
})
export class SystemIncomeGraph extends BaseComponent implements AfterViewInit {
  @Input()
  averageBlockTime: number = 5;
  @Input()
  durationYears: number = 10;
  @Input()
  startBalance: number = 0;
  @Input()
  startPerBlockIncome: number = 0;
  @Input()
  yearIncomeChange: number = 1;
  @Input()
  emissionCurve: number = 8;
  @Input()
  startVolume: number = 0;
  @Input()
  yearlyVolumeChange: number = 1;
  @Input()
  feePerVolume: number = 0;

  get blocksPerYear() { return 365 * 24 * 60 * 60 / this.averageBlockTime }
  runeSupply = 500000000 - 100000000; //100M are in standby reserve

  get duration() { return this.durationYears * this.blocksPerYear }

  checkpoints = 50;
  get checkpointInterval() { return this.duration / this.checkpoints }

  graphEntries: SeriesOption[] = [];
  options: EChartsOption = null!;

  @ViewChild(NgxEchartsDirective)
  element: NgxEchartsDirective = null!;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

  public generateCharts() {
    const perBlockReduction = 1 / (this.blocksPerYear * this.emissionCurve);
    const perBlockIncomeGain = Math.pow(this.yearIncomeChange, 1 / this.blocksPerYear);

    const balances: number[] = [];
    const blockRewards: number[] = [];

    var currentIncome = this.startPerBlockIncome;
    var currentBalance = this.startBalance;

    for (var i = 0; i < this.duration; i++) {
      const blockReward = currentBalance * perBlockReduction;

      if (i % this.checkpointInterval < 1) {
        balances.push(currentBalance);
        blockRewards.push(blockReward);
      }

      currentIncome *= perBlockIncomeGain;
      currentBalance -= blockReward;
      currentBalance += currentIncome;
    }

    const swapVolumes = [];
    const totalVolumeChange = Math.pow(this.yearlyVolumeChange, this.durationYears);
    const perCheckPointVolumeChange = Math.pow(totalVolumeChange, 1 / this.checkpoints);

    for (var i = 0; i < this.checkpoints; i++) {
      const changeTillCheckpoint = Math.pow(perCheckPointVolumeChange, i);
      swapVolumes.push(this.startVolume * changeTillCheckpoint);
    }

    const liquidityFees = swapVolumes.map(x => this.feePerVolume * x);

    const blockRewardSeries: SeriesOption = {
      name: "Block Rewards",
      type: "line",
      smooth: true,
      stack: "counts",
      areaStyle: {},
      data: blockRewards
    };
    const liquidityFeeSeries: SeriesOption = {
      name: "Liquidity Fees",
      type: "line",
      smooth: true,
      stack: "counts",
      areaStyle: {},
      data: liquidityFees
    };

    this.graphEntries = [blockRewardSeries, liquidityFeeSeries];

    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          }
        }
      },
      legend: {
        show: true,
        textStyle: {
          color: "white",
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: Array.from(Array(this.checkpoints).keys())
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: (x: number) => x.toFixed(3)
          }
        },
      ],
      series: this.graphEntries
    };

    this.element.refreshChart();
  }
}
