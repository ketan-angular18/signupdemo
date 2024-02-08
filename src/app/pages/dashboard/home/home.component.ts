import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent { 
  constructor(private route:Router){}

  /**
   * @logout method for remove token form localstorage
   * and navigate user to the login page
   */
  logout(): void {
    localStorage.removeItem('token')
    alert('logout Sucessfully')
    this.route.navigate([''])
  }
}
