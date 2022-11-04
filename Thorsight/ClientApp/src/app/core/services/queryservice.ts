import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timeout } from "rxjs";
import { LiquidityAction, OpenPosition, PoolStatistics, PositionSnapshot, SystemPerformance, SystemStatistics } from "../models/models";
import { Location, LocationStrategy } from '@angular/common';

@Injectable()
export class QueryService {
  apiUrl: string = "";

  constructor(private locationStrategy: LocationStrategy, private location: Location, private httpClient: HttpClient) {
    this.apiUrl = this.locationStrategy.prepareExternalUrl("api/");
  }

  public getSystemStatisticsHistory(days: number): Observable<SystemStatistics[]> {
    return this.httpClient.get<SystemStatistics[]>(this.apiUrl + "SystemIncome", {
      params: { 'days': days }
    })
      .pipe(
        timeout(90000)
      );
  }

  public getSystemPerformance(): Observable<SystemPerformance> {
    return this.httpClient.get<SystemPerformance>(this.apiUrl + "SystemPerformance")
      .pipe(
        timeout(90000)
      );
  }

  public getLiquidityActions(address: string): Observable<LiquidityAction[]> {
    return this.httpClient.get<LiquidityAction[]>(this.apiUrl + "LiquidityActions/" + address)
      .pipe(
        timeout(90000),
      );
  }

  public getOpenLiquidityPositions(address: string): Observable<OpenPosition[]> {
    return this.httpClient.get<OpenPosition[]>(this.apiUrl + "LiquidityPositions/" + address)
      .pipe(
        timeout(90000),
      );
  }

  public getLiquidtyPositionHistory(address: string, days: number): Observable<PositionSnapshot[]> {
    return this.httpClient.get<PositionSnapshot[]>(this.apiUrl + "PositionHistory/" + address, {
      params: { 'days': days }
    })
      .pipe(
        timeout(150000),
      );
  }
}
