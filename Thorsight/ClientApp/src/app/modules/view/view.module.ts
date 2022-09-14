import { NgModule } from "@angular/core";
import { OverviewPage } from "./pages/overview/overview.page";
import { NavComponent } from "./components/navbar/nav.component";
import { EarningsPage } from "./pages/earnings/earnings.page";
import { ViewComponent } from "./view.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule } from "@angular/router";
import * as AppRoutingModule from '../../app-routing.module';
import { ViewCacheService } from "./services/view-cache.service";
import { AssetWorthGraph } from "./pages/overview/components/assert-worth-graph/asset-worth.graph";
import { AssetAmountGraph } from "./pages/overview/components/asset-amount-graph/asset-amount.graph";
import { LuviGraph } from "./pages/earnings/components/luvi-graph/luvi.graph";
import { IlpGraph } from "./pages/earnings/components/ilp-graph/ilp.graph";

@NgModule({
  declarations: [
    ViewComponent,
    OverviewPage,
    EarningsPage,

    NavComponent,
    AssetWorthGraph,
    AssetAmountGraph,
    IlpGraph,
    LuviGraph
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AppRoutingModule.viewRoutes)
  ]
})
export class ViewModule { }
