import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { AddusersComponent } from './addusers/addusers.component';
import { ProfileComponent } from './profile/profile.component';

/**
 * routes for generate routes
 */
const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'users',component:UsersComponent},
  {path:'addusers',component:AddusersComponent},
  {path:'profile',component:ProfileComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
