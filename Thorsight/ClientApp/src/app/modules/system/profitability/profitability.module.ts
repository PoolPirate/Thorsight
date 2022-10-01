import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfitabilityComponent } from "./profitability.component";
import { SharedModule } from "../../../shared/shared.module";
import * as AppRoutingModule from '../../../app-routing.module';
import { IncomeHistoryGraph } from "./pages/systemincome/components/income-history-graph/income-history.graph";
import { ProfitabilityDashboardPage } from "./pages/systemincome/dashboard.page";
import { EarningsBreakdownGraph } from "./pages/systemincome/components/earnings-breakdown-graph/earnings-breakdown.graph";
import { ProfitabilityCalculatorPage } from "./pages/calculator/calculator.page";
import { ReserveBalanceGraph } from "./pages/calculator/components/reserve-balance-graph/reserve-balance.graph";
import { BlockRewardsGraph } from "./pages/calculator/components/block-rewards-graph/block-rewards.graph";
import { SystemIncomeGraph } from "./pages/calculator/components/system-income-graph/system-income.graph";
import { SwapVolumeProjectionGraph } from "./pages/calculator/components/swap-volume-graph/swap-volume.graph";
import { SwapVolumeGraph } from "./pages/systemincome/components/swap-volume-graph/swap-volume.graph";

@NgModule({
  declarations: [
    ProfitabilityComponent,

    ProfitabilityDashboardPage,
    ProfitabilityCalculatorPage,

    IncomeHistoryGraph,
    EarningsBreakdownGraph,
    SwapVolumeGraph,

    ReserveBalanceGraph,
    BlockRewardsGraph,
    SwapVolumeProjectionGraph,
    SystemIncomeGraph
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AppRoutingModule.profitabilitySubRoutes)
  ]
})
export class ProfitabilityModule { }
