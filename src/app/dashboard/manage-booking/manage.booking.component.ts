import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './manage.booking.component.html',
  styleUrls: ['./manage.booking.component.css', '../../app.component.css'],
})
export class ManageBookingComponent implements OnInit {
  monArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  bookings;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  todaysdate;

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit() {
    // console.log(new Date().toDateString());
    var d = new Date().toDateString();
    var month = (this.monArr.indexOf(d.split(' ')[1]) + 1).toString();
    if (parseInt(month) < 10) {
      month = '0' + month;
    }
    var year = d.split(' ')[3];
    var day = d.split(' ')[2];
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    this.todaysdate = year + '-' + month + '-' + day;
    // console.log(todaysdate);
    this.getBookings('initial');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      scrollX: true,
      responsive: true,
      dom: 'frtip',
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Export to Excel',
          idName: 'buttonGreen',
        },
      ],
    };
  }
  cancelBooking(id) {
    this.appService.cancelBooking(id).subscribe(
      (data) => {
        console.log('Slot cancelled successfully!');
        this.getBookings('update');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getBookings(status) {
    this.appService.getBookings(this.todaysdate).subscribe(
      (data) => {
        this.bookings = data;
        // console.log('bookings: ' + JSON.stringify(this.bookings));
        if (status === 'initial') this.dtTrigger.next();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
