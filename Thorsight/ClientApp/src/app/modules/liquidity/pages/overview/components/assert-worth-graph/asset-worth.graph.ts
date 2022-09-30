import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewChildren } from "@angular/core";
import { EChartsOption, SeriesOption, ECharts } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ColorUtils } from "../../../../../../shared/utils/color-utils";
import { BaseComponent } from "../../../../../../shared/component/base.component";
import { takeUntil } from "rxjs";
import { LiquidityCacheService } from "../../../../services/liquidity-cache.service";

@Component({
  selector: 'asset-worth-graph',
  templateUrl: './asset-worth.graph.html',
  styleUrls: ['./asset-worth.graph.scss'],
})
export class AssetWorthGraph extends BaseComponent implements AfterViewInit {
  pools: string[] = [];
  timestamps: string[] = [];
  poolValues: SeriesOption[] = [];
  options: EChartsOption = null!;

  initialized: boolean = false;

  @ViewChild(NgxEchartsDirective)
  element: NgxEchartsDirective = null!;

  constructor(private viewCache: LiquidityCacheService, private changeDetector: ChangeDetectorRef) {
    super();
    this.viewCache.onSelectChange
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.generateCharts();
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
    this.generateCharts();
  }

  generateCharts() {
    this.pools = this.viewCache.positionHistories!.map(x => x.poolName).filter(this.onlyUnique).reverse();
    this.timestamps = this.viewCache.positionHistories!.map(x => x.timestamp).filter(this.onlyUnique);

    const breakEvenPrices: number[] = [];

    this.poolValues = this.pools.map(pool => {
      const values = this.viewCache.positionHistories!.filter(stat => stat.poolName == pool).map((position, i, _) => {
        breakEvenPrices[i] = breakEvenPrices[i] > 0
          ? breakEvenPrices[i] + position.breakEvenValue
          : position.breakEvenValue;

        return position.valueUSD;
      });
      const temp: SeriesOption = {
        name: pool,
        type: 'line',
        stack: 'counts',
        areaStyle: {},
        data: values,
        color: ColorUtils.getAssetColor(pool)
      };
      return temp;
    });

    this.poolValues.push({
      name: "Break Even",
      type: 'line',
      data: breakEvenPrices,
      color: 'green'
    });

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

    this.element.refreshChart();
  }
}
