import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewChildren } from "@angular/core";
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { takeUntil } from "rxjs";
import { BaseComponent } from "../../../../../../../shared/component/base.component";
import { ColorUtils } from "../../../../../../../shared/utils/color-utils";
import { ProfitabilityCacheService } from "../../../../services/profitability-cache.service";

@Component({
  selector: 'swap-volume-graph',
  templateUrl: './swap-volume.graph.html',
  styleUrls: ['./swap-volume.graph.scss'],
})
export class SwapVolumeGraph extends BaseComponent implements AfterViewInit {
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

    const swapVolumeSeries: SeriesOption =
    {
      name: "Swap Volume",
      type: "line",
      smooth: true,
      areaStyle: {
      },
      data: this.cache.systemStatisticsHistory!.map(x => x.swapVolume),
      color: ColorUtils.getSwapVolumeCategoryColor("actual")
    };

    const offsetSwapVolumeSeries: SeriesOption =
    {
      name: "Offset Swap Volume",
      type: "line",
      smooth: true,
      areaStyle: {
      },
      data: this.cache.systemStatisticsHistory!.map(x => x.swapVolume * (1 + x.blockRewards / x.liquidityFee)),
      color: ColorUtils.getSwapVolumeCategoryColor("offset")
    };

    this.graphEntries = [swapVolumeSeries, offsetSwapVolumeSeries];

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
