import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

//model
import { SignupUser } from 'src/app/model/interface/loginuser';

//services
import { ChatService } from 'src/app/services/chat/chat.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {

  /**
   * @chatservice for inject chatservice
   * @route for inject router
   * @location for inject location
   * @toast for inject toaster service for toaster message
   * @userdata for bind model with fields 
   * @currentuserId for getting currentuseridfrom localstorage
   * @profileform for for create new formgroup
   */
  private chatservice = inject(ChatService)
  private route = inject(Router);
  private location = inject(Location)
  private toast = inject(ToastrService)
  userdata: SignupUser = new SignupUser();
  currentuserId = JSON.parse(localStorage.getItem('currentuserId') ?? 'null');
  profileForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ])
    });

  /**
   * ngOnInit angular hook for load current user data from service and patch user data to form 
   */
  ngOnInit(): void {
    this.chatservice.currentUserProfile(this.currentuserId).subscribe(userdata => {
      if (userdata) {
        this.profileForm.patchValue({
          name: userdata.name,
          email: userdata.email,
          password: userdata.password
        });
      }
    }, error => {
      console.log('Error while featch user data =>', error)
    })
  }

  /**
   * controls for return this form controls
   */
  get controls() : { [key: string]: AbstractControl } {
    return this.profileForm.controls
  }

  /**
   * back for return back location
   */
  back(): void {
    this.location.back()
  }

  /**
   * Submit for form submit 
   * @returns if form is invalid 
   * @else call update profile method for update data 
   */
  Submit(): void {
    if (this.profileForm.invalid) {
      return
    }
    else {
      this.updateProfile()
    }
  }

  /**
   * updateProfile for update user data
   * this method call updateuserdata method of service and pass user id for refrence and user data for update userdata
   */
  updateProfile(): void {
    this.chatservice.updateUserData(this.currentuserId, this.userdata).then(() => {
      this.toast.success('User data Updated Sucessfully')
      this.route.navigate(['/dashboard/home'])
    })
  }
}
