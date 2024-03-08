import { Component,OnDestroy} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsMatchValidator } from 'src/app/helper/passwordmatchvalidator/passwordmatchvalidator';
import { inject } from '@angular/core';
import { catchError, map, take, tap, throwError } from 'rxjs';
import { Subscription } from 'rxjs';

//model
import { SignupUser } from 'src/app/model/interface/loginuser';

//services
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent implements OnDestroy {

  /**
   * @signupData for bind model with form
   * @auth for inject authentication service
   * @toast for toast message
   */
  signupData: SignupUser = new SignupUser();
  private mysignup! : Subscription
  private auth = inject(AuthenticationService);
  private toast= inject(ToastrService)
  signUpForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validators: [passwordsMatchValidator()],
    }
  );

  /**
   * @get controls for get the controls of the form for validation
   */
  get controls() : { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  /**
   * @submit method of form
   * @if data is invalid then return the user
   * @else if data is valid then call the method Signup of service and send user email and password for signup
   * @returns
   */
  submit(): void {
    if (!this.signUpForm.valid) {
      return;
    } else {
    this.mysignup = this.auth.getAllUser().snapshotChanges().pipe(take(1),
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        tap((data) => {
          const user = data.find((userdata) => {
            return userdata.email === this.signUpForm.get('email')?.value;
          });
          if (user) {
            this.toast.error('Email is already taken. Please sign up with a new one.');
          } else {
            this.auth.signUp(this.signupData);
          }
        }),
        catchError((error) => {
          console.error('Error:', error);
          this.toast.error(error);
          return throwError(error);
        }))
      .subscribe();
    }
  }
  
  /**
   * ngOnDestroy for  Unsubscribe to prevent memory leaks when the component is destroyed
   * 
   */
  ngOnDestroy(): void {
    if(this.mysignup)
    {
      this.mysignup.unsubscribe()
    }
  }
}
