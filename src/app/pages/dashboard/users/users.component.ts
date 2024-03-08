import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { user } from 'src/app/model/interface/loginuser';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

//services
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NavbarComponent,
            CommonModule,
            MatIconModule,
            RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {

  /**
   * @route for inject router for navigation
   * @toast for inject toaster for toaster message
   * @userservice for inject userservice
   * @userdata for get all user data in observable
   */
  private route = inject(Router);
  private toast = inject(ToastrService)
  private userservice = inject(UserService)
  userdata$: Observable<user[]> | undefined;

  /**
   * ngOnInit for get all user from user service 
   */
  ngOnInit(): void {
    this.userdata$ = this.userservice.allUser()
  }

  /**
   * editUser for edit user
   * @param id for pass user id the user you want to edit 
   */
  editUser(id: string): void {
    this.route.navigate(['/dashboard/addusers'], {
      queryParams: { id: id }
    });
  }

  /**
   * deleteUser for delete user 
   * @param id for paas the id of user that you want to delete
   */
  deleteUser(id: string): void {
    this.userservice.deleteUser(id).then(() => {
      this.toast.success('User deleted Sucessfully !!!!')
    })
  }
}
