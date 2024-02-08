import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Loginuser } from 'src/app/model/interface/loginuser';
import { signupUsersList } from 'src/app/model/interface/loginuser';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  logindata!: Loginuser;
  signupuserlist: signupUsersList[] = [];

  /**
   * @param auth for calling authentication service
   * @param route for navigate after singin user
   */
  constructor(
    private auth: AuthenticationService,
    private formbuilder: FormBuilder,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.logindata = new Loginuser();
    this.loginForm = this.formbuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  /**
   * get formcontrol is return the cotrols of form for validation
   */
  get formcontrol() {
    return this.loginForm.controls;
  }

  /**
   * login method for login the user
   * @if loginform is invalid than user is return
   * @else if login form is valid than user call the getuserdata methhod from service
   * @returns and this method return the data and find user data into it if user is valid then redirect to home page else throw the alert  error
   */
  login(): void {
    if (this.loginForm.invalid) {
      this.submitted=true
      return;
    } else {
      this.auth
        .getUserData()
        .pipe(
          tap((data: signupUsersList[]) => {
            this.signupuserlist = data;
            const user = this.signupuserlist.find((userdata) => {
              return (
                userdata.email === this.logindata.email &&
                userdata.password === this.logindata.password
              );
            });
            if (user) {
              alert('login successfully');
              localStorage.setItem('token', 'true');
              this.route.navigate(['dashboard/home']);
            } else {
              alert('invalid email and password');
              this.loginForm.reset();
            }
          }),
          catchError((error) => {
            console.error('Error during signup:', error);
            console.error(`Error status: ${error.status}`);
            console.error(`Error message: ${error.message}`);
            alert('An error occurred during signup. Please try again later.');
            return throwError(error);
          })
        )
        .subscribe();
    }
  }
}
