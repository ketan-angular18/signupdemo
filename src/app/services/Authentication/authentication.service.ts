import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import {AngularFireDatabase,AngularFireList} from '@angular/fire/compat/database';

//models
import { SignupUser } from 'src/app/model/interface/loginuser';

//service
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {

  /**
   * @dbpath for database path
   * @Userlist for firelist
   * @route for navigation
   * @toast for toast message
   */
  private dbPath = '/signupUsersList';
  Userlist: AngularFireList<SignupUser>;
  private route = inject(Router);
  private toast = inject(ToastrService);
  private db = inject(AngularFireDatabase)
  constructor() {
    this.Userlist = this.db.list(this.dbPath);
  }

  /** For islogin
   * @returns  true if user is login else false
   */
  isLogin(): boolean {
    return localStorage.getItem('token') !== null;
  }

  /**
   * @getuserdata for get all user data from server
   * @returns  collection all user
   */
  getAllUser(): AngularFireList<SignupUser> {
    return this.Userlist;
  }

  /**
   * @SingUp for sign up a new user
   * @param data for send data of Singup user
   * @returns error if any error is come during singup
   */
  signUp(data: SignupUser) : Promise<void> {
    return this.db
      .list('/signupUsersList').push(data).catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error(
          'An error occurred during signup. Please try again later.'
        );
        return throwError(error);
      })
      .then(() => {
        this.toast.success('Sign Up Successful. Now login with your credentials.');
        this.route.navigate(['']);
      });
  }
}
