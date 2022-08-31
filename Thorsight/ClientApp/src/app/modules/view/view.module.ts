import { NgModule } from "@angular/core";
import { OverviewPage } from "./pages/overview/overview.page";
import { NavComponent } from "./components/navbar/nav.component";
import { EarningsPage } from "./pages/earnings/earnings.page";
import { ViewComponent } from "./view.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule } from "@angular/router";
import * as AppRoutingModule from '../../app-routing.module';
import { ViewCacheService } from "./services/view-cache.service";

@NgModule({
  declarations: [
    ViewComponent,
    OverviewPage,
    EarningsPage,

    NavComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(AppRoutingModule.viewRoutes)
  ]
})
export class ViewModule { }
