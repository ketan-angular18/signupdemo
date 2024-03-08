import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

//models
import { user } from 'src/app/model/interface/loginuser';

//services
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-addusers',
  standalone: true,
  imports: [NavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule],
  templateUrl: './addusers.component.html',
  styleUrl: './addusers.component.css'
})

export class AddusersComponent implements OnInit   {

  /**
   * @adduser for bind user model with form
   * @userservice for inject userservice
   * @formBuilder for inject formbuilder
   * @router for inject router
   * @route for inject route
   * @toast for inject toastr service
   * @submitted for getting form state
   * @isAddMode for checking add mode or update mode
   * @id for pass edit user  id
   */
  adduser: user = new user();
  private userservice = inject(UserService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private toast = inject(ToastrService);
  submitted = false;
  isAddMode!: boolean
  id!: string;
  registerForm = this.formBuilder.group({
    first_name: (['', Validators.required]),
    last_name: (['', Validators.required]),
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    password: ['', [Validators.required, Validators.minLength(5),]]
  });

  /**
   * ngOnInit for check whether is addmode or update mode 
   * if update mode than set form data get from database and set data 
   */
  ngOnInit() :void {
    this.id = this.route.snapshot.queryParams['id'];
    this.isAddMode = !this.id
    this.userservice.allUser().subscribe(data => {
      const isuser = data.find((m: user) => m.key === this.id);
      if (isuser !== undefined) {
        this.adduser.firstname = isuser.password;
        this.adduser.firstname = isuser.firstname;
        this.adduser.lastname = isuser.lastname;
        this.adduser.email = isuser.email;
      }
    })
  }

  /**get formcontrols for get the controls of the form for get register for controls
  */
  get formcontrols() : { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  /**For onsubmit
  * if form is invalid than return
  * else check is add mode or update mode
  * and then call method of add adduserdata or updateuserdata
  */
  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    else {
      if (this.isAddMode) {
        this.addUserData()
      }
      else {
        this.updateUserData()
      }
    }
  }

  /**
   * addUserData for add userdata to the database
   * Call method add user data from service and add user and navigate to userslist
   */
  addUserData(): void {
    this.userservice.addUser(this.adduser).then(() => {
      this.toast.success('User added Sucessfully !!!!');
      this.router.navigate(['dashboard/users'])
    })
  }

  /**
   * updateUserData for update user data at data base 
   * call methhod updateuser from service and update user and show message and navigate to userslist
   */
  updateUserData(): void {
    this.userservice.updateUser(this.id, this.adduser).then(() => {
      this.toast.success('User Updated Sucessfully !!!!');
      this.router.navigate(['dashboard/users'])
    })
  }
}
