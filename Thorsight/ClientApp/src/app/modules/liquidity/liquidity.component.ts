import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs';
import { LiquidityAction, OpenPosition } from '../../core/models/models';
import { QueryService } from '../../core/services/queryservice';
import { BaseComponent } from '../../shared/component/base.component';
import { LiquidityCacheService } from './services/liquidity-cache.service';

@Component({
  selector: 'liquidity-root',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss'],
  providers: [
    LiquidityCacheService
  ]
})
export class LiquidityComponent extends BaseComponent {
  positionSelector = new FormControl("all");
  daysSelector = new FormControl(30);

  constructor(private route: ActivatedRoute, private viewCache: LiquidityCacheService, private queryService: QueryService) {
    super();
    const routeSnapshot = route.snapshot;
    const address: string = routeSnapshot.params["address"];

    this.loadLiquidityActions(address);
    this.loadOpenPositions(address);
    this.loadLiquidityPositionHistories(address);

    this.positionSelector.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
      this.viewCache.selected = this.positionSelector.value;
    });
    this.daysSelector.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.viewCache.dayCount = this.daysSelector.value;
        this.viewCache.allPositionHistories = null;
        this.loadLiquidityPositionHistories(address);
    })
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

  loadLiquidityPositionHistories(address: string) {
    this.queryService.getLiquidtyPositionHistory(address, this.viewCache.dayCount)
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
