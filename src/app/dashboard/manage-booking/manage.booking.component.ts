import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './manage.booking.component.html',
  styleUrls: ['./manage.booking.component.css', '../../app.component.css'],
})
export class ManageBookingComponent {
  constructor(private router: Router) {}
}
