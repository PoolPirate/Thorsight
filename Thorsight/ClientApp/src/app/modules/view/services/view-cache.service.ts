import { Injectable } from "@angular/core";
import { LiquidityAction, OpenPosition } from "../../../core/models/models";

@Injectable()
export class ViewCacheService {
  allActions: LiquidityAction[] | null = null;
  allOpenPositions: OpenPosition[] | null = null;

  selected: string | "all" = "all";

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
}
