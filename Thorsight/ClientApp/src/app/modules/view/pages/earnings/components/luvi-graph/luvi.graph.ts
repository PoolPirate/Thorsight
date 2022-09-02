import { AfterViewInit, Component, ViewChild, ViewChildren } from "@angular/core";
import { ViewCacheService } from "../../../../services/view-cache.service";
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ColorUtils } from "../../../../../../shared/utils/color-utils";
import { BaseComponent } from "../../../../../../shared/component/base.component";
import { takeUntil } from "rxjs";
import { OnInit } from "@angular/core";

@Component({
  selector: 'luvi-graph',
  templateUrl: './luvi.graph.html',
  styleUrls: ['./luvi.graph.scss'],
})
export class LuviGraph extends BaseComponent implements OnInit {
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

  ngOnInit(): void {
    if (!this.isLoading && !this.initialized) {
      this.initialize();
    }
  }

  get isLoading() {
    return this.viewCache.allPositionHistories == null;
  }

  onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  initialize() {
    if (this.isLoading) {
      return;
    }

    this.initialized = true;

    this.pools = this.viewCache.positionHistories!.map(x => x.poolName).filter(this.onlyUnique).reverse();
    this.timestamps = this.viewCache.positionHistories!.map(x => x.timestamp).filter(this.onlyUnique);

    this.poolValues = this.pools.map(pool => {
      const values = this.viewCache.positionHistories!.filter(stat => stat.poolName == pool).map(x => Math.sqrt(100000000 * 100000000 * x.runeAmount * x.assetAmount) / x.currentStakeUnits);
      const temp: SeriesOption = {
        name: pool,
        type: 'line',
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
  }
}
