import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "../shared/shared.module";
import { QueryService } from "./services/queryservice";
import { HomePage } from "./pages/home/home.page";
import { FooterComponent } from "../shared/components/footer/footer.component";

@NgModule({
  declarations: [
    AppComponent,

    HomePage,
  ],
  imports: [
    BrowserModule,
    SharedModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    QueryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
