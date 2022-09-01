import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LiquidityAction, OpenPosition, PoolStatistics } from "../../../core/models/models";

@Injectable()
export class ViewCacheService {
  private _allActions: LiquidityAction[] | null = null;
  private _allOpenPositions: OpenPosition[] | null = null;
  private _allPositionHistories: OpenPosition[] | null = null;
  private _selected: string | "all" = "all";
  private _poolStats: PoolStatistics[] | null = null;

  get allActions() {
    return this._allActions;
  }
  get allOpenPositions() {
    return this._allOpenPositions;
  }
  get allPositionHistories() {
    return this._allPositionHistories;
  }
  get poolStats() {
    return this._poolStats;
  }
  set allActions(value: LiquidityAction[] | null) {
    this._allActions = value;
    this.contentUpdatedSubject.next();
  }
  set allOpenPositions(value: OpenPosition[] | null) {
    this._allOpenPositions = value;
    this.contentUpdatedSubject.next();
  }
  set allPositionHistories(value: OpenPosition[] | null) {
    this._allPositionHistories = value;
    this.contentUpdatedSubject.next();
  }
  set poolStats(value: PoolStatistics[] | null) {
    this._poolStats = value;
    this.contentUpdatedSubject.next();
  }

  get selected(): string | "all" {
    return this._selected;
  }
  set selected(value: string) {
    this._selected = value;
    this.selectedSubject.next();
  }

  private selectedSubject: Subject<void> = new Subject();
  onSelectChange: Observable<void> = this.selectedSubject.asObservable();

  private contentUpdatedSubject: Subject<void> = new Subject();
  onContentUpdated: Observable<void> = this.contentUpdatedSubject.asObservable();

  get actions(): LiquidityAction[] {
    if (this.selected == "all") {
      return this.allActions ?? [];
    }

    return (this.allActions ?? []).filter(x => x.poolName == this.selected);
  }

  get openPositions(): OpenPosition[] {
    if (this.selected == "all") {
      return this.allOpenPositions ?? [];
    }

    return (this.allOpenPositions ?? []).filter(x => x.poolName == this.selected);
  }

  get positionHistories(): OpenPosition[] {
    if (this.selected == "all") {
      return this.allPositionHistories ?? [];
    }

    return (this.allPositionHistories ?? []).filter(x => x.poolName == this.selected);
  }
}
