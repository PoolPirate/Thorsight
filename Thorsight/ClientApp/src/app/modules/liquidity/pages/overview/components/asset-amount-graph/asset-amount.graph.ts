import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewChildren } from "@angular/core";
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ColorUtils } from "../../../../../../shared/utils/color-utils";
import { BaseComponent } from "../../../../../../shared/component/base.component";
import { takeUntil } from "rxjs";
import { OnInit } from "@angular/core";
import { LiquidityCacheService } from "../../../../services/liquidity-cache.service";

@Component({
  selector: 'asset-amount-graph',
  templateUrl: './asset-amount.graph.html',
  styleUrls: ['./asset-amount.graph.scss'],
})
export class AssetAmountGraph extends BaseComponent implements AfterViewInit {
  pools: string[] = [];
  timestamps: string[] = [];
  poolValues: SeriesOption[] = [];
  runeValues: number[] = [];
  options: EChartsOption = null!;

  initialized: boolean = false;

  @ViewChild(NgxEchartsDirective)
  element: NgxEchartsDirective = null!;

  constructor(private viewCache: LiquidityCacheService, private changeDetector: ChangeDetectorRef) {
    super();
    this.viewCache.onSelectChange
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.generateChart();
      });

    this.viewCache.onContentUpdated
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.initialize();
      });
  }

  ngAfterViewInit(): void {
    this.initialize();
    this.changeDetector.detectChanges();
  }

  get isLoading() {
    return this.viewCache.allPositionHistories == null;
  }

  onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }

  initialize() {
    if (this.element == null) {
      return;
    }
    if (this.isLoading || this.initialized) {
      this.initialized = !this.isLoading;
      return;
    }

    this.initialized = true;
    this.generateChart();
  }

  generateChart() {
    this.pools = this.viewCache.positionHistories!.map(x => x.poolName).filter(this.onlyUnique).reverse();
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
        data: values.map(x => x == 0 ? "" : x),
        color: ColorUtils.getAssetColor(pool)
      };
      return temp;
    });

    const runeSeries: SeriesOption = {
      name: "THOR.RUNE",
      type: 'line',
      data: this.runeValues.map(x => x == 0 ? '' : x),
      color: ColorUtils.getAssetColor("THOR.RUNE")
    };

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
          type: 'log',
          logBase: 10
        }
      ],
      series: this.poolValues
    };

    this.element.refreshChart();
  }
}
