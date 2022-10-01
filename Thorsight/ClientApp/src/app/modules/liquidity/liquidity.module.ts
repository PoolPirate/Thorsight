import { NgModule } from "@angular/core";
import { OverviewPage } from "./pages/overview/overview.page";
import { EarningsPage } from "./pages/earnings/earnings.page";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule } from "@angular/router";
import * as AppRoutingModule from '../../app-routing.module';
import { AssetWorthGraph } from "./pages/overview/components/assert-worth-graph/asset-worth.graph";
import { AssetAmountGraph } from "./pages/overview/components/asset-amount-graph/asset-amount.graph";
import { LuviGraph } from "./pages/earnings/components/luvi-graph/luvi.graph";
import { IlpGraph } from "./pages/earnings/components/ilp-graph/ilp.graph";
import { LiquidityComponent } from "./liquidity.component";

@NgModule({
  declarations: [
    LiquidityComponent,
    OverviewPage,
    EarningsPage,

    AssetWorthGraph,
    AssetAmountGraph,
    IlpGraph,
    LuviGraph
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AppRoutingModule.liquiditySubRoutes)
  ]
})
export class LiquidityModule { }
