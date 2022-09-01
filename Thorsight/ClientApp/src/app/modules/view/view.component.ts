import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs';
import { LiquidityAction, OpenPosition } from '../../core/models/models';
import { QueryService } from '../../core/services/queryservice';
import { BaseComponent } from '../../shared/component/base.component';
import { ViewCacheService } from './services/view-cache.service';

@Component({
  selector: 'view-root',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [
    ViewCacheService
  ]
})
export class ViewComponent extends BaseComponent {
  positionSelector = new FormControl("all");

  constructor(private route: ActivatedRoute, private viewCache: ViewCacheService, private queryService: QueryService) {
    super();
    const routeSnapshot = route.snapshot;
    const address: string = routeSnapshot.params["address"];

    this.loadLiquidityActions(address);
    this.loadOpenPositions(address);
    this.loadPoolStatistics();
    this.loadLiquidityPositionHistories(address);

    this.positionSelector.valueChanges.subscribe(() => {
      this.viewCache.selected = this.positionSelector.value;
    });
  }

  get allOpenPositions(): OpenPosition[] {
    return this.viewCache.allOpenPositions ?? [];
  }

  loadLiquidityActions(address: string) {
    this.queryService.getLiquidityActions(address)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.viewCache.allActions = x;
      }, err => {
        alert("Failed loading data!");
      });
  }

  loadOpenPositions(address: string) {
    this.queryService.getOpenLiquidityPositions(address)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.viewCache.allOpenPositions = x;
      }, err => {
        alert("Failed loading data!");
      });
  }

  loadPoolStatistics() {
    this.queryService.getDailyPoolStats()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.viewCache.poolStats = x;
      }, err => {
        alert("Failed loading data!");
      });
  }

  loadLiquidityPositionHistories(address: string) {
    this.queryService.getLiquidtyPositionHistory(address)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(x => {
        this.viewCache.allPositionHistories = x;
      }, err => {
        alert("Failed loading data!");
      });
  }
}
