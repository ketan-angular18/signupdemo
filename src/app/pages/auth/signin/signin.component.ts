import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, tap, throwError } from 'rxjs';
import { Subscription } from 'rxjs';

//model
import { Loginuser } from 'src/app/model/interface/loginuser';

//services
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})

export class SignInComponent implements OnDestroy {

  /**
   * @logindata for bind form value to loginform
   * @loginservice for Inject service
   * @formbuilder for inject formbuilder
   * @route for inject router for navigation
   * @toast for inject toastr for messages
   * @mylogin for pass subscription
   * @submitted for check for is submited or not 
   */
  submitted = false;
  logindata: Loginuser = new Loginuser();
  private loginservice = inject(AuthenticationService);
  private formbuilder = inject(FormBuilder);
  private route = inject(Router);
  private mylogin!: Subscription;
  private toast = inject(ToastrService);
  loginForm = this.formbuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ],
    ],
    password: ['', Validators.required],
  });

  /**
   * get formcontrol is return the cotrols of form for validation
   */
  get formcontrol()  : { [key: string]: AbstractControl } {
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
      this.submitted = true;
      return;
    } else {
      this.mylogin = this.loginservice.getAllUser().snapshotChanges().pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))))
        .pipe(tap((data) => {
          const user = data.find((userdata) => {
            return (
              userdata.email === this.logindata.email &&
              userdata.password === this.logindata.password
            );
          });
          if (user) {
            localStorage.setItem('currentuserId', JSON.stringify(user.key))
            this.toast.success('Login Sucess');
            localStorage.setItem('token', 'true');
            this.route.navigate(['dashboard/home']);
          } else {
            this.toast.error('invalid email and password');
            this.loginForm.reset();
          }
        }),
          catchError((error) => {
            console.error('Error:', error);
            return throwError(error);
          })).subscribe();
    }
  }

  /**
   * ngOnDestroy for  Unsubscribe to prevent memory leaks when the component is destroyed
   * 
   */
  ngOnDestroy(): void {
    if (this.mylogin) {
      this.mylogin.unsubscribe();
    }
  }
}
