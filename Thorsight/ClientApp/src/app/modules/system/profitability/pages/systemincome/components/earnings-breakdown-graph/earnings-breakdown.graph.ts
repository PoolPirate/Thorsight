import { WHITE_ON_BLACK_CSS_CLASS } from "@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector";
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewChildren } from "@angular/core";
import { EChartsOption, PieSeriesOption } from 'echarts';
import { NgxEchartsDirective, ThemeOption } from 'ngx-echarts';
import { takeUntil } from "rxjs";
import { BaseComponent } from "../../../../../../../shared/component/base.component";
import { ColorUtils } from "../../../../../../../shared/utils/color-utils";
import { ProfitabilityCacheService } from "../../../../services/profitability-cache.service";

@Component({
  selector: 'earnings-breakdown-graph',
  templateUrl: './earnings-breakdown.graph.html',
  styleUrls: ['./earnings-breakdown.graph.scss'],
})
export class EarningsBreakdownGraph extends BaseComponent implements AfterViewInit {
  graphEntries: PieSeriesOption[] = [];
  options: EChartsOption = null!;
  theme: ThemeOption | string = null!;

  initialized: boolean = false;

  @ViewChild(NgxEchartsDirective)
  element: NgxEchartsDirective = null!;

  constructor(private cache: ProfitabilityCacheService, private changeDetector: ChangeDetectorRef) {
    super();
    this.cache.onContentUpdated
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.initialize();
      });
  }
  
  ngAfterViewInit(): void {
    this.initialize();
    this.changeDetector.detectChanges();
  }

  get isLoading() {
    return this.cache.systemStatisticsHistory == null;
  }


  initialize() {
    if (this.element == null) {
      console.log(this);
      return;
    }
    if (this.isLoading || this.initialized) {
      this.initialized = !this.isLoading;
      return;
    }

    this.initialized = true;
    this.generateCharts();
  }

  generateCharts() {

    const totalLiquidityFees = Math.round(100 * this.cache.systemStatisticsHistory!.reduce<number>((value, income, i, arr) => value + income.liquidityFee, 0)) / 100;
    const totalBlockRewards = Math.round(100 * this.cache.systemStatisticsHistory!.reduce<number>((value, income, i, arr) => value + income.blockRewards, 0)) / 100;

    const breakdown: PieSeriesOption = {
      name: "Earnings",
      type: "pie",
      radius: [60, 110],
      data: [
        {
          name: "Liquidity Fees",
          value: totalLiquidityFees,
          itemStyle: {
            color: ColorUtils.getEarningsCategoryColor("liquidityfees")
          }
        },
        {
          name: "Block Rewards",
          value: totalBlockRewards,
          itemStyle: {
            color: ColorUtils.getEarningsCategoryColor("blockrewards")
          }
        }
      ],
    }

    this.graphEntries = [breakdown];

    this.options = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} RUNE ({d}%)'
      },
      legend: {
        top: '5%',
        left: 'center',
        data: ['Liquidity Fees', 'Block Rewards'],
        textStyle: {
          color: "white"
        }
      },
      series: [
        {
          name: 'Earnings',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: totalBlockRewards,
              name: 'Block Rewards',
              itemStyle: {
                color: ColorUtils.getEarningsCategoryColor("blockrewards")
              }
            },
            {
              value: totalLiquidityFees,
              name: 'Liquidity Fees',
              itemStyle: {
                color: ColorUtils.getEarningsCategoryColor("liquidityfees")
              }
            },
          ]
        }
      ]
    } as EChartsOption;

    this.element.refreshChart();
  }
}
