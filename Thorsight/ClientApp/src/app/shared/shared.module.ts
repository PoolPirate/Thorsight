import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxEchartsModule } from 'ngx-echarts';
import { FooterComponent } from "./components/footer/footer.component";

@NgModule({
  declarations: [
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatSidenavModule,
    MatIconModule,

    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,

    MatCardModule,
    MatProgressSpinnerModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatSidenavModule,
    MatIconModule,

    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,

    MatCardModule,
    MatProgressSpinnerModule,

    NgxEchartsModule,

    FooterComponent
  ],
  providers: [

  ]
})
export class SharedModule { }
