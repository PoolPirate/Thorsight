import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewChildren } from "@angular/core";
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { takeUntil } from "rxjs";
import { BaseComponent } from "../../../../../../../shared/component/base.component";
import { ColorUtils } from "../../../../../../../shared/utils/color-utils";
import { ProfitabilityCacheService } from "../../../../services/profitability-cache.service";

@Component({
  selector: 'income-history-graph',
  templateUrl: './income-history.graph.html',
  styleUrls: ['./income-history.graph.scss'],
})
export class IncomeHistoryGraph extends BaseComponent implements AfterViewInit {
  graphEntries: SeriesOption[] = [];
  options: EChartsOption = null!;

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

    const liquidityFeeSeries: SeriesOption =
    {
      name: "Liquidity Fees",
      type: "bar",
      stack: "counts",
      data: this.cache.systemStatisticsHistory!.map(x => x.liquidityFee),
      color: ColorUtils.getEarningsCategoryColor("liquidityfees")
    };

    const blockRewardsSeries: SeriesOption =
    {
      name: "Block Rewards",
      type: "bar",
      stack: "counts",
      data: this.cache.systemStatisticsHistory!.map(x => x.blockRewards),
      color: ColorUtils.getEarningsCategoryColor("blockrewards")
    }

    this.graphEntries = [liquidityFeeSeries, blockRewardsSeries];

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
          data: this.cache.systemStatisticsHistory!.map(x => x.timestamp)
        }
      ],
      yAxis: [
        {
          type: 'value',
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
