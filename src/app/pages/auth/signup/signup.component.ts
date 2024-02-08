import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsMatchValidator } from 'src/app/helper/passwordmatchvalidator/passwordmatchvalidator';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';
import { SignupUser } from 'src/app/model/interface/loginuser';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupData!: SignupUser;
  signUpForm = new FormGroup(
    {
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
  constructor(private auth: AuthenticationService, private locatin: Location) {}

  /**
   * ngonInit method for create new instance of class when component is load
   */
  ngOnInit(): void {
    this.signupData = new SignupUser();
  }

  /**
   * @get controls for get the controls of the form for validation
   */
  get controls(){
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
      this.auth.Signup(this.signupData.email, this.signupData.password);
    }
  }

  /**
   * @back method for back to the login page
   */
  back() :void {
    this.locatin.back();
  }
}
