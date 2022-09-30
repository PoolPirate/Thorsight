import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfitabilityComponent } from "./profitability.component";
import { SharedModule } from "../../../shared/shared.module";
import * as AppRoutingModule from '../../../app-routing.module';
import { IncomeHistoryGraph } from "./pages/systemincome/components/income-history-graph/income-history.graph";
import { SystemIncomePage } from "./pages/systemincome/systemincome.page";
import { EarningsBreakdownGraph } from "./pages/systemincome/components/earnings-breakdown-graph/earnings-breakdown.graph";
import { SwapVolumeGraph } from "./pages/systemincome/components/swap-volume-graph/swap-volume.graph";

@NgModule({
  declarations: [
    ProfitabilityComponent,

    SystemIncomePage,

    IncomeHistoryGraph,
    EarningsBreakdownGraph,
    SwapVolumeGraph
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AppRoutingModule.profitabilitySubRoutes)
  ]
})
export class ProfitabilityModule { }
