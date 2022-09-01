import { Component, ViewChild, ViewChildren } from "@angular/core";
import { ViewCacheService } from "../../../../services/view-cache.service";
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ColorUtils } from "../../../../../../shared/utils/color-utils";
import { BaseComponent } from "../../../../../../shared/component/base.component";
import { takeUntil } from "rxjs";

@Component({
  selector: 'asset-worth-graph',
  templateUrl: './asset-worth.graph.html',
  styleUrls: ['./asset-worth.graph.scss'],
})
export class AssetWorthGraph extends BaseComponent {
  pools: string[] = [];
  timestamps: string[] = [];
  poolValues: SeriesOption[] = [];
  options: EChartsOption = null!;

  initialized: boolean = false;

  @ViewChild(NgxEchartsDirective)
  element: NgxEchartsDirective = null!;

  constructor(private viewCache: ViewCacheService) {
    super();
    this.viewCache.onSelectChange
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.initialize();
        this.element.refreshChart();
      })
    this.viewCache.onContentUpdated
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        if (!this.isLoading && !this.initialized) {
          this.initialize();
        }
      });
  }

  get isLoading() {
    return this.viewCache.allPositionHistories == null || this.viewCache.poolStats == null;
  }

  onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  initialize() {
    this.initialized = true;

    this.pools = this.viewCache.positionHistories.map(x => x.poolName).filter(this.onlyUnique);
    this.timestamps = this.viewCache.positionHistories!.map(x => x.timestamp).filter(this.onlyUnique);

    this.poolValues = this.pools.map(pool => {
      const values = this.viewCache.positionHistories!.filter(stat => stat.poolName == pool).map(x => x.valueUSD);
      const temp: SeriesOption = {
        name: pool,
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: values,
        color: ColorUtils.getAssetColor(pool)
      };
      return temp;
    })

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
          data: this.timestamps
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: this.poolValues
    };

    console.log(this.options);
  }
}