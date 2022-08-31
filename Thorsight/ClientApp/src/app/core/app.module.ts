import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "../shared/shared.module";
import { Flipside } from "@flipsidecrypto/sdk";
import { QueryService } from "./services/queryservice";
import { HomePage } from "./pages/home/home.page";

@NgModule({
  declarations: [
    AppComponent,

    HomePage
  ],
  imports: [
    BrowserModule,
    SharedModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: Flipside,
      useFactory: () => new Flipside(
        "8faeb2f9-8e14-4481-91f3-e713c1038e8c",
        "https://node-api.flipsidecrypto.com"
      )
    },
    QueryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
