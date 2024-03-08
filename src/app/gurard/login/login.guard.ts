import { CanActivate } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

//service
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
@Injectable({ providedIn: 'root' })

export class LoginGuard implements CanActivate {

  /**
  * @Authentication for inject authenticatin service
  * @rout for inject router
  */
  private Authentication = inject(AuthenticationService)
  private route = inject(Router)

  /**
   * CanActivate for check user is logged in or not
   * @returns false if user is login and navigate user to the home screen else return true 
   */
  canActivate(): boolean {
    if (this.Authentication.isLogin()) {
      this.route.navigate(['dashboard/home']);
      return false;
    } else {
      return true;
    }
  }
}
