import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {GpsTaskComponent} from "./tasks/gps-task/gps-task.page";
import {QrTaskComponent} from "./tasks/qr-task/qr-task.page";
import {DistanceTaskComponent} from "./tasks/distance-task/distance-task.page";

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'tasks/qr', component: QrTaskComponent },
  { path: 'tasks/gps', component: GpsTaskComponent },
  { path: 'tasks/distance', component: DistanceTaskComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
