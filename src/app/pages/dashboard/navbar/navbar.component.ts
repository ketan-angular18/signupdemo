import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

//services
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog/dialog.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule,
            MatToolbarModule, 
            MatButton,
            RouterModule,
            MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})

export class NavbarComponent {

  /**
   * @route for navigation
   * @toast for toastrmessage
   * @dialog for inject dialog service 
   */
  private route = inject(Router);
  private toast = inject(ToastrService);
  private dialog = inject(DialogService)

  /** 
   * logout for logout user 
   * @if user click on yes on dialog then remove data  token localstorage
   * and navigate user to the login page
   */
  async logout(): Promise<void> {
    const userClickYes = await this.dialog.openYesNoDialog();
    if (userClickYes) {
      localStorage.clear()
      this.toast.success('Logout Sucessfully');
      this.route.navigate(['']);
    }
  }
}
