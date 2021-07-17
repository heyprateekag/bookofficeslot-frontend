import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { ChartsModule } from 'ng2-charts';
import * as $ from 'jquery';
import { MatDialogModule } from '@angular/material/dialog';
import {
  BookDialog,
  MainDashboardComponent,
} from './dashboard/main-dashboard/main.dashboard.component';
import { ManageBookingComponent } from './dashboard/manage-booking/manage.booking.component';
import { DataTablesModule } from 'angular-datatables';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: MainDashboardComponent,
      },
      {
        path: 'managebookings',
        component: ManageBookingComponent, // another child route component that the router renders
      },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    DashboardComponent,
    MainDashboardComponent,
    ManageBookingComponent,
    BookDialog,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    DataTablesModule,
    FontAwesomeModule,
    NoopAnimationsModule,
    MatCarouselModule.forRoot(),
    ChartsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
