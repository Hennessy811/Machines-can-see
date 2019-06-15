import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CameraComponent} from "./components/camera/camera.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {WebcamModule} from "ngx-webcam";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule
} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    WebcamModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
