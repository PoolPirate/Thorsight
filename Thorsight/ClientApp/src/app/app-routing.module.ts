import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { HomePage } from './core/pages/home/home.page';
import { LiquidityComponent } from './modules/liquidity/liquidity.component';
import { EarningsPage } from './modules/liquidity/pages/earnings/earnings.page';
import { OverviewPage } from './modules/liquidity/pages/overview/overview.page';
import { SystemIncomePage } from './modules/system/profitability/pages/systemincome/systemincome.page';
import { ProfitabilityComponent } from './modules/system/profitability/profitability.component';

export const routes: Routes = [
  {
    path: "", pathMatch: "full", component: HomePage
  },
  {
    path: "liquidity", pathMatch: "full",
    redirectTo: ""
  },
  {
    path: "liquidity/:address", component: LiquidityComponent,
    loadChildren: () => import("./modules/liquidity/liquidity.module").then(x => x.LiquidityModule)
  },
  {
    path: "system/profitability", component: ProfitabilityComponent,
    loadChildren: () => import("./modules/system/profitability/profitability.module").then(x => x.ProfitabilityModule)
  }
];

export const liquiditySubRoutes: Routes = [
  {
    path: "", pathMatch: "full", redirectTo: "overview"
  },
  {
    path: "overview", component: OverviewPage
  },
  {
    path: "earnings", component: EarningsPage
  }
];

export const profitabilitySubRoutes: Routes = [
  {
    path: "", pathMatch: "full", component: SystemIncomePage
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
