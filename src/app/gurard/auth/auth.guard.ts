import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

//service
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

  /**
   * @Authentication for inject authenticatin service
   * @rout for inject router
   */
  private Authentication = inject(AuthenticationService)
  private route = inject(Router)

  /**
   * @Canactivate for check user is login or not 
   * @returns true if user is login else return false and navigate user to the login page
   */
  canActivate(): boolean {
    if (this.Authentication.isLogin()) {
      return true;
    } else {
      this.route.navigate(['']);
      return false;
    }
  }
}
