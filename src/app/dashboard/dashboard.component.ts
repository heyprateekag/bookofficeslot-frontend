import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../app.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import {
  MatDialog,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userDetails;

  constructor(
    private appService: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
  }

  openDashboard() {
    this.router.navigate(['/dashboard']);
  }

  openManageBookings() {
    this.router.navigate(['/dashboard/managebookings']);
  }

  logout() {
    this.router.navigate(['/']);
  }
}
