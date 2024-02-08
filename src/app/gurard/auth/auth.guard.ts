import { CanActivate } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private Authentication: AuthenticationService,
    private route: Router
  ) {}

/**
 * @Canactivate for check user is login or not 
 * @returns true if user is login else return false and navigae user to the login page
 */
  canActivate() :boolean {
    if (this.Authentication.isLogin()) {
      return true;
    } else {
      this.route.navigate(['']);
      return false;
    }
  }
}
