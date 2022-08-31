import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, timeout } from "rxjs";
import { LiquidityAction, OpenPosition } from "../models/models";
import { Location, LocationStrategy } from '@angular/common';

@Injectable()
export class QueryService {
  apiUrl: string = "";

  constructor(private locationStrategy: LocationStrategy, private location: Location, private httpClient: HttpClient) {
    console.log(this.location);
    this.apiUrl = this.locationStrategy.prepareExternalUrl("api/");
  }

  public getLiquidityActions(address: string): Observable<LiquidityAction[]> {
    return this.httpClient.get<LiquidityAction[]>(this.apiUrl + "LiquidityActions/" + address)
      .pipe(
        timeout(20000),
      );
  }

  public getOpenLiquidityPositions(address: string): Observable<OpenPosition[]> {
    return this.httpClient.get<OpenPosition[]>(this.apiUrl + "LiquidityPositions/" + address)
      .pipe(
        timeout(20000),
      );
  }
}
