import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BaseComponent } from "../../../../../../../shared/component/base.component";

@Component({
  selector: 'reserve-balance-graph',
  templateUrl: './reserve-balance.graph.html',
  styleUrls: ['./reserve-balance.graph.scss'],
})
export class ReserveBalanceGraph extends BaseComponent implements AfterViewInit {
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

  blocksPerYear = 5256000;
  runeSupply = 500000000;

  duration = this.durationYears * this.blocksPerYear;

  checkpoints = 64;
  checkpointInterval = this.duration / this.checkpoints;

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

    const incomes: number[] = [];
    const balances: number[] = [];

    var currentIncome = this.startPerBlockIncome;
    var currentBalance = this.startBalance;

    for (var i = 0; i < this.duration; i++) {
      const blockReward = currentBalance * perBlockReduction;

      if (i % this.checkpointInterval == 0) {
        incomes.push(currentIncome);
        balances.push(currentBalance);
      }

      currentIncome *= perBlockIncomeGain;
      currentBalance -= blockReward;
      currentBalance += currentIncome;
    }

    const balanceSeries: SeriesOption = {
      name: "Reserve Balance",
      type: "line",
      yAxisId: "0",
      areaStyle: {},
      smooth: true,
      data: balances
    };
    const incomeSeries: SeriesOption = {
      name: "Reserve Income",
      type: "line",
      yAxisId: "1",
      smooth: true,
      data: incomes
    };

    this.graphEntries = [incomeSeries, balanceSeries];

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
          id: 0,
          type: 'value',
          axisLabel: {
            formatter: (x: number) => x.toFixed(3)
          }
        },
        {
          id: 1,
          type: "value",
          axisLabel: {
            formatter: (x: number) => x.toFixed(3)
          }
        }
      ],
      series: this.graphEntries
    };

    this.element.refreshChart();
  }
}
