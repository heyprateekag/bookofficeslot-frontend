import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  // @Input() enteredEmail = '';
  @Input('f') loginForm: NgForm;
  testData = '';
  enteredUsername;
  enteredPassword;
  constructor(private appService: AppService, private router: Router) {}

  ngOnInit(): void {}

  testEntered() {
    console.log(this.testData);
  }

  loginme() {
    this.appService.login(this.enteredUsername, this.enteredPassword).subscribe(
      (data) => {
        if (data['login']) {
          localStorage.setItem('userDetails', JSON.stringify(data['user']));
          this.router.navigate(['/dashboard']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
