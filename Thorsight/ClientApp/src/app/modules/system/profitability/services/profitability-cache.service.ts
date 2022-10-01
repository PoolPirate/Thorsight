import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SystemPerformance, SystemStatistics } from "../../../../core/models/models";

@Injectable()
export class ProfitabilityCacheService {
  private _dayCount: number = 30;

  private _systemStatisticsHistory: SystemStatistics[] | null = null;
  private _systemPerformance: SystemPerformance | null = null;

  get complete() {
    return this._systemStatisticsHistory != null && this._systemPerformance != null;
  }

  get dayCount() {
    return this._dayCount;
  }
  get systemStatisticsHistory() {
    return this._systemStatisticsHistory;
  }
  get systemPerformance() {
    return this._systemPerformance;
  }

  set dayCount(value: number) {
    this._dayCount = value;
    this.dayCountUpdatedSubject.next();
  }
  set systemStatisticsHistory(value: SystemStatistics[] | null) {
    this._systemStatisticsHistory = value;
    this.contentUpdatedSubject.next();
  }
  set systemPerformance(value: SystemPerformance | null) {
    this._systemPerformance = value;
    this.contentUpdatedSubject.next();
  }

  private dayCountUpdatedSubject: Subject<void> = new Subject();
  onDayCountUpdated: Observable<void> = this.dayCountUpdatedSubject.asObservable();

  private contentUpdatedSubject: Subject<void> = new Subject();
  onContentUpdated: Observable<void> = this.contentUpdatedSubject.asObservable();

}
