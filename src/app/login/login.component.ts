import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../app.component.css'],
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    //api call to check the credentials
    this.router.navigate(['/dashboard']); //'/' makes it an absolute path which mnz this will open our base link/dashboard
    //if we would have passed only 'dashboard' then it would have tried to open current link/dashboard in other words
    //it would have just added /dashboard in the current opened link
  }
}
