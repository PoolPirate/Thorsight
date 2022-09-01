import { Component, ViewChild, ViewChildren } from "@angular/core";
import { ViewCacheService } from "../../../../services/view-cache.service";
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ColorUtils } from "../../../../../../shared/utils/color-utils";
import { BaseComponent } from "../../../../../../shared/component/base.component";
import { takeUntil } from "rxjs";

@Component({
  selector: 'asset-amount-graph',
  templateUrl: './asset-amount.graph.html',
  styleUrls: ['./asset-amount.graph.scss'],
})
export class AssetAmountGraph extends BaseComponent {
  pools: string[] = [];
  timestamps: string[] = [];
  poolValues: SeriesOption[] = [];
  runeValues: number[] = [];
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
    return this.viewCache.allPositionHistories == null;
  }

  onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  initialize() {
    this.initialized = true;

    this.pools = this.viewCache.positionHistories.map(x => x.poolName).filter(this.onlyUnique).reverse();
    this.timestamps = this.viewCache.positionHistories!.map(x => x.timestamp).filter(this.onlyUnique);

    this.runeValues = [];

    this.poolValues = this.pools.map(pool => {
      const values = this.viewCache.positionHistories!.filter(stat => stat.poolName == pool).map((position, i, _) => {
        this.runeValues[i] = this.runeValues[i] > 0
          ? this.runeValues[i] + position.runeAmount
          : position.runeAmount;

        return position.assetAmount
      });
      const temp: SeriesOption = {
        name: pool,
        type: 'line',
        data: values,
        color: ColorUtils.getAssetColor(pool)
      };
      return temp;
    });

    const runeSeries: SeriesOption = {
      name: "THOR.RUNE",
      type: 'line',
      data: this.runeValues,
      color: ColorUtils.getAssetColor("THOR.RUNE")
    };

    console.log(runeSeries);

    this.poolValues.push(runeSeries);


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
          type: 'log'
        }
      ],
      series: this.poolValues
    };

    console.log(this.options);
  }
}
