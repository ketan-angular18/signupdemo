import { CanActivate } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private Authentication: AuthenticationService,
    private route: Router
  ) {}

  /**
   * CanActivate for check user is logged in or not
   * @returns false if user is login and navigate user to the home screen else return true 
   */
  canActivate() :boolean {
    if (this.Authentication.isLogin()) {
      this.route.navigate(['dashboard/home']);
      return false;
    } else {
      return true;
    }
  }
}
