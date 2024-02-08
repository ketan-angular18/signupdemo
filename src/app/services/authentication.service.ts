import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { signupUsersList } from 'src/app/model/interface/loginuser';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Loginuser } from 'src/app/model/interface/loginuser';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private route: Router) {}

  /**
   * @getuserdata for get all user data from server
   */
  getUserData(): Observable<signupUsersList[]> {
    return this.http.get<signupUsersList[]>(`${environment.baseurl}/signupUsersList`)
  }

/**
 * 
 * @param email for send email of the user 
 * @param password for send password of the user 
 * @returns login user
 */
 
  Signup(email: string, password: string) {
    return this.http.post<Loginuser>(`${environment.baseurl}/signupUsersList`, { email, password })
      .pipe(
        tap((data) => {
          alert('Sign Up Successful. Now login with your credentials.');
          this.route.navigate(['']);
        }),
        catchError((error) => {
          console.error('Error during signup:', error);
          console.error(`Error status: ${error.status}`);
          console.error(`Error message: ${error.message}`);
          alert('An error occurred during signup. Please try again later.');
          return throwError(error);
        })
      ).subscribe();
  }
  

  /** For islogin
   * @returns  true if user is login else false
   */
  isLogin() :boolean {
    return localStorage.getItem('token') !== null;
  }
}
