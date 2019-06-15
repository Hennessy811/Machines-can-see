import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CameraComponent} from "./components/camera/camera.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'engage'
  },
  {
    path: 'engage', component: CameraComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
