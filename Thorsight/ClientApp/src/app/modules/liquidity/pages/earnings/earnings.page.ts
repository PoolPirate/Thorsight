import { Component } from "@angular/core";
import { EChartsOption } from 'echarts';

@Component({
  selector: 'earnings-page',
  templateUrl: './earnings.page.html',
  styleUrls: ['./earnings.page.scss']
})
export class EarningsPage {
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };
}
