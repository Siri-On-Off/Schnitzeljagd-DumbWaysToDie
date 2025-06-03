import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {GpsTaskComponent} from "./tasks/gps-task/gps-task.component";
import {QrTaskComponent} from "./tasks/qr-task/qr-task.component";

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
  { path: 'task/qr', component: QrTaskComponent },
  { path: 'task/gps', component: GpsTaskComponent },
  {
    path: 'tasks/qr',
    component: QrTaskComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
