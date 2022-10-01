import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BaseComponent } from "../../../../../../../shared/component/base.component";

@Component({
  selector: 'swap-volume-projection-graph',
  templateUrl: './swap-volume.graph.html',
  styleUrls: ['./swap-volume.graph.scss'],
})
export class SwapVolumeProjectionGraph extends BaseComponent implements AfterViewInit {
  @Input()
  durationYears: number = 10;
  @Input()
  startVolume: number = 0;
  @Input()
  yearlyVolumeChange: number = 1;

  checkpoints = 64;

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
    const swapVolumes = [];
    const totalVolumeChange = Math.pow(this.yearlyVolumeChange, this.durationYears);
    const perCheckPointVolumeChange = Math.pow(totalVolumeChange, 1 / this.checkpoints);

    for (var i = 0; i < this.checkpoints; i++) {
      const changeTillCheckpoint = Math.pow(perCheckPointVolumeChange, i);
      swapVolumes.push(this.startVolume * changeTillCheckpoint);
    }

    const swapVolumeSeries: SeriesOption = {
      name: "Swap Volume",
      type: "line",
      smooth: true,
      data: swapVolumes
    };

    this.graphEntries = [swapVolumeSeries];

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
        }
      ],
      series: this.graphEntries
    };

    this.element.refreshChart();
  }
}
