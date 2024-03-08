import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import {LoginGuard}from './gurard/login/login.guard';
import { AuthGuard } from './gurard/auth/auth.guard';

const routes: Routes = [
  {
    path:'',
    canActivate:[LoginGuard],
    loadChildren:()=>import('./pages/auth/auth.module').then(
      module=>module.AuthModule
    )
  },
  {
    path:'dashboard',
    canActivate:[AuthGuard],
    loadChildren:()=>import('./pages/dashboard/dashboard.module').then(
      module=>module.DashboardModule,
    )
  },
  // {
  //   path:'**',
  //   component:NotfoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
