import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './main.dashboard.component.html',
  styleUrls: ['./main.dashboard.component.css', '../../app.component.css'],
})
export class MainDashboardComponent {
  constructor(private router: Router) {}
}
