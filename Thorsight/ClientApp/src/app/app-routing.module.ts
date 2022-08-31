import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './core/pages/home/home.page';
import { EarningsPage } from './modules/view/pages/earnings/earnings.page';
import { OverviewPage } from './modules/view/pages/overview/overview.page';
import { ViewComponent } from './modules/view/view.component';

export const routes: Routes = [
  {
    path: "", pathMatch: "full", component: HomePage
  },
  {
    path: ":address", loadChildren: () => import("../app/modules/view/view.module").then(x => x.ViewModule), component: ViewComponent
  }
];

export const viewRoutes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
