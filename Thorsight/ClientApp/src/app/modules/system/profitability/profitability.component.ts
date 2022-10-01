import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs';
import { QueryService } from '../../../core/services/queryservice';
import { BaseComponent } from '../../../shared/component/base.component';
import { ProfitabilityCacheService } from './services/profitability-cache.service';

@Component({
  selector: 'profitability-root',
  templateUrl: './profitability.component.html',
  styleUrls: ['./profitability.component.scss'],
  providers: [
    ProfitabilityCacheService
  ]
})
export class ProfitabilityComponent extends BaseComponent {
  daysSelector = new FormControl(30);

  constructor(private cache: ProfitabilityCacheService, private queryService: QueryService) {
    super();

    this.daysSelector.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cache.dayCount = this.daysSelector.value;
        this.cache.systemStatisticsHistory = null;
        this.loadSystemStatistics();
      });

    this.loadSystemStatistics();
  }

  loadSystemStatistics() {
    this.queryService.getSystemStatisticsHistory(this.cache.dayCount)
      .subscribe(x => {
        this.cache.systemStatisticsHistory = x;
      }, err => {
        alert("Failed loading data!");
      });
  }
}
