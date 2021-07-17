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

export interface DialogData {
  selectedDate;
  status; //booked, toBook
  availability; //0-total number of slots
  remark;
  cancelSlot;
}
var monthArr = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
var bookedSlots; //for storing the dates when logged in user has booked his slots
const totalSlots = 50;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './calendarStyling.css'],
})
export class DashboardComponent implements OnInit {
  userDetails;
  slides;
  cal;
  selectedDate;
  savedAvailableSlots;
  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontColor: '#293b5f',
        fontStyle: 'bold',
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: '#293b5f',
            fontStyle: 'bold',
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontColor: '#293b5f',
            fontStyle: 'bold',
            beginAtZero: true,
          },
        },
      ],
    },
  };
  public barChartLabels: Label[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public canvasHeight = '180px';
  public canvasWidth = '200px !important';

  usersOnDateTemp = [
    { name: 'John Doe' },
    { name: 'Akhil' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
    { name: 'Anand' },
  ];
  usersOnDate;
  remark;
  startDate;
  cancelSlot; //true or false to get to know whether user has asked to cancel his/her slot or not
  endDate;
  openMonth;
  barChartData: ChartDataSets[];

  constructor(
    private appService: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.getBookedSlots('initial');
    // console.log(JSON.stringify(this.userDetails));
    this.appService.getAllUpdates().subscribe((data) => {
      this.slides = data;
    });
  }

  getBookedSlots(status) {
    this.appService.getBookedSlots(this.userDetails.email).subscribe((data) => {
      bookedSlots = data;
      console.log('bookedSlots: ' + JSON.stringify(bookedSlots));
      if (status === 'initial') {
        this.cal = new Calendar();
        this.cal.init();
      } else if (status === 'update') {
        this.cal.draw();
      }
      this.selectedDate = this.getDate(new Date().toDateString().split(' ')[2]);
      // console.log(new Date().toDateString());
      // console.log('today: ' + this.selectedDate);
      this.getBookedUsersForDate(this.selectedDate);
      this.startDate =
        this.selectedDate.split('-')[0] +
        '-' +
        this.selectedDate.split('-')[1] +
        '-01';
      this.endDate =
        this.selectedDate.split('-')[0] +
        '-' +
        this.selectedDate.split('-')[1] +
        '-31';
      this.availableSlots(this.startDate, this.endDate);
      this.openMonth = moment();
      // console.log(JSON.stringify(this.bookedSlots));
    });
  }

  availableSlots(startDate, endDate) {
    this.appService.getAvailableSlots(startDate, endDate).subscribe((data) => {
      this.savedAvailableSlots = data;
      // console.log(this.savedAvailableSlots);
      this.updateGraph(this.openMonth);
      this.getAvailableSlotForDay(this.selectedDate);
    });
  }

  getBookedUsersForDate(date) {
    this.appService.getBookedUsersForDate(date).subscribe((data) => {
      this.usersOnDate = data;
      // console.log("users: "+JSON.stringify(this.usersOnDate));
    });
  }

  prevMonth() {
    this.cal.removeMonth();
    let mon = (
      monthArr.indexOf(this.cal.monthString.split(' ')[0]) + 1
    ).toString();
    if (parseInt(mon) < 10) {
      mon = '0' + mon;
    }
    this.startDate = this.cal.monthString.split(' ')[1] + '-' + mon + '-01';
    this.endDate = this.cal.monthString.split(' ')[1] + '-' + mon + '-31';
    this.availableSlots(this.startDate, this.endDate);
    this.openMonth.subtract(1, 'month');
    // console.log(this.month.clone().endOf('month').date());
    // this.updateGraph(this.openMonth);
  }

  nextMonth() {
    this.cal.addMonth();
    let mon = (
      monthArr.indexOf(this.cal.monthString.split(' ')[0]) + 1
    ).toString();
    if (parseInt(mon) < 10) {
      mon = '0' + mon;
    }
    this.startDate = this.cal.monthString.split(' ')[1] + '-' + mon + '-01';
    this.endDate = this.cal.monthString.split(' ')[1] + '-' + mon + '-31';
    this.availableSlots(this.startDate, this.endDate);
    this.openMonth.add(1, 'month');
  }

  updateGraph(month) {
    let barChartLabelsTemp = [];
    let tempData = [];
    let i = 0;
    for (i = 0; i < month.clone().endOf('month').date(); i++) {
      barChartLabelsTemp.push(i + 1);
      // tempData.push(this.getAvailableSlotForDay(i+1));
      let temp = this.getAvailableSlotForDay(i + 1);
      // console.log(typeof(temp))
      tempData[i] = temp;
    }
    this.barChartData = [
      {
        data: tempData,
        label: 'Available slots',
        barThickness: 5,
        backgroundColor: '#b2ab8c',
        hoverBackgroundColor: '#293b5f',
      },
    ];
    this.barChartLabels = barChartLabelsTemp;
    // console.log(tempData);
  }

  getDate(day) {
    let mon = (
      monthArr.indexOf(this.cal.monthString.split(' ')[0]) + 1
    ).toString();
    if (parseInt(mon) < 10) {
      mon = '0' + mon;
    }
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
    let year = this.cal.monthString.split(' ')[1];
    let date = year + '-' + mon + '-' + day;
    return date;
  }

  getAvailableSlotForDay(day) {
    var date = this.getDate(day);
    var reqObject = this.savedAvailableSlots.find((obj) => {
      return obj.date === date;
    });
    if (!reqObject) {
      return totalSlots;
    } else {
      return reqObject.available_slots;
    }
  }

  dateClicked(row, coloumn) {
    var idName = 'div' + row + coloumn;
    if (
      document
        .getElementById(idName)
        .classList.contains('cal-day__month--current')
    ) {
      var selectedDay = document.getElementById(idName).innerHTML;
      this.selectedDate = this.getDate(selectedDay);
      this.getBookedUsersForDate(this.selectedDate);
      var statusTemp;
      var objTemp = bookedSlots.find((obj) => {
        return obj.bookingdate === this.selectedDate;
      });
      console.log('bookedSlots: ' + JSON.stringify(bookedSlots));
      console.log('objTemp: ' + JSON.stringify(objTemp));
      console.log('selectedDate: ' + this.selectedDate);
      if (!objTemp) {
        statusTemp = 'toBook';
      } else {
        statusTemp = 'booked';
      }
      const dialogRef = this.dialog.open(BookDialog, {
        width: '50em',
        data: {
          selectedDate: this.selectedDate,
          status: statusTemp, //toBook or booked
          availability: this.getAvailableSlotForDay(selectedDay),
          remark: this.remark,
          cancelSlot: false,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        // console.log('The dialog was closed');
        // console.log(result);
        this.remark = result; //undefined if not booked
        if (this.remark && this.remark !== true) {
          console.log('book');
          //book slot
          var jsonObject = {
            name: this.userDetails.name,
            email: this.userDetails.email,
            bookingdate: this.selectedDate,
            remark: this.remark,
            status: 'Confirmed',
          };
          console.log(JSON.stringify(jsonObject));
          this.appService.bookSlot(jsonObject).subscribe(
            (data) => {
              console.log('Slot booked: ' + data);
            },
            (err) => {
              console.log('Some error occured! ' + JSON.stringify(err));
              this.getBookedSlots('update');
            }
          );
        }
        this.cancelSlot = result;
        if (this.cancelSlot === true) {
          var jsonObjectTemp = {
            email: this.userDetails.email,
            bookingdate: this.selectedDate,
          };
          this.appService.cancelSlot(jsonObjectTemp).subscribe(
            (data) => {
              console.log(
                'Slot cancelled successfully! ' + JSON.stringify(data)
              );
            },
            (err) => {
              console.log(JSON.stringify(err));
              this.getBookedSlots('update');
            }
          );
        }
      });
    }
  }

  logout() {
    this.router.navigate(['/']);
  }
}

class Calendar {
  month;
  today;
  selected;
  weekDays;
  monthDiv;
  headDivs;
  bodyDivs;
  // nextDiv;
  // prevDiv;
  calendarDays;
  monthDays;
  monthString;
  mainClass;

  constructor() {
    this.monthDiv = document.querySelector('.cal-month__current');
    this.headDivs = document.querySelectorAll('.cal-head__day');
    this.bodyDivs = document.querySelectorAll('.cal-body__day');
    // this.nextDiv = document.querySelector('.cal-month__next');
    // this.prevDiv = document.querySelector('.cal-month__previous');
  }

  init() {
    // moment.locale(window.navigator.userLanguage || window.navigator.language)
    this.month = moment();
    this.today = this.selected = this.month.clone();
    this.weekDays = moment.weekdaysShort(true);

    this.headDivs.forEach((day, index) => {
      day.innerText = this.weekDays[index];
    });

    // this.nextDiv.addEventListener('click', (_) => {
    //   this.addMonth();
    // });
    // this.prevDiv.addEventListener('click', (_) => {
    //   this.removeMonth();

    // });

    this.bodyDivs.forEach((day) => {
      day.addEventListener('click', (e) => {
        const date =
          +e.target.innerHTML < 10
            ? `0${e.target.innerHTML}`
            : e.target.innerHTML;

        if (e.target.classList.contains('cal-day__month--next')) {
          this.selected = moment(
            `${this.month.add(1, 'month').format('YYYY-MM')}-${date}`
          );
        } else if (e.target.classList.contains('cal-day__month--previous')) {
          this.selected = moment(
            `${this.month.subtract(1, 'month').format('YYYY-MM')}-${date}`
          );
        } else {
          this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`);
        }

        this.update();
      });
    });

    this.update();
  }

  update() {
    this.calendarDays = {
      first: this.month.clone().startOf('month').startOf('week').date(),
      last: this.month.clone().endOf('month').date(),
    };

    this.monthDays = {
      lastPrevious: this.month
        .clone()
        .subtract(1, 'months')
        .endOf('month')
        .date(),
      lastCurrent: this.month.clone().endOf('month').date(),
    };

    this.monthString = this.month.clone().format('MMMM YYYY');

    this.draw();
  }

  addMonth() {
    this.month.add(1, 'month');

    this.update();
  }

  removeMonth() {
    this.month.subtract(1, 'month');

    this.update();
  }

  draw() {
    this.monthDiv.innerText = this.monthString;

    let index = 0;

    if (this.calendarDays.first > 1) {
      for (
        let day = this.calendarDays.first;
        day <= this.monthDays.lastPrevious;
        index++
      ) {
        this.bodyDivs[index].innerText = day++;

        this.cleanCssClasses(false, index);

        this.bodyDivs[index].classList.add('cal-day__month--previous');
      }
    }

    let isNextMonth = false;
    for (let day = 1; index <= this.bodyDivs.length - 1; index++) {
      if (day > this.monthDays.lastCurrent) {
        day = 1;
        isNextMonth = true;
      }

      this.cleanCssClasses(true, index);

      if (!isNextMonth) {
        if (day === this.today.date() && this.today.isSame(this.month, 'day')) {
          this.bodyDivs[index].classList.add('cal-day__day--today');
        }

        if (
          day === this.selected.date() &&
          this.selected.isSame(this.month, 'month')
        ) {
          this.bodyDivs[index].classList.add('cal-day__day--selected');
        }

        this.bodyDivs[index].classList.add('cal-day__month--current');
      } else {
        this.bodyDivs[index].classList.add('cal-day__month--next');
      }

      var traversedDay;
      if (day < 10) {
        traversedDay = '0' + day;
      } else {
        traversedDay = day;
      }
      let traversedMonth = (
        monthArr.indexOf(this.monthString.split(' ')[0]) + 1
      ).toString();
      if (parseInt(traversedMonth) < 10) {
        traversedMonth = '0' + traversedMonth;
      }
      var traversedDate =
        this.monthString.split(' ')[1] +
        '-' +
        traversedMonth +
        '-' +
        traversedDay;
      // console.log(traversedDate);
      // console.log(JSON.stringify(bookedSlots));
      var reqObject = bookedSlots.find((obj) => {
        return obj.bookingdate === traversedDate;
      });
      if (reqObject) {
        if (
          !this.bodyDivs[index].classList.contains('cal-day__month--next') &&
          !this.bodyDivs[index].classList.contains('cal-day__month--previous')
        )
          this.bodyDivs[index].classList.add('dateBooked');
      }
      this.bodyDivs[index].innerText = day++;
    }
  }

  cleanCssClasses(selected, index) {
    this.bodyDivs[index].classList.contains('cal-day__month--next') &&
      this.bodyDivs[index].classList.remove('cal-day__month--next');
    this.bodyDivs[index].classList.contains('cal-day__month--previous') &&
      this.bodyDivs[index].classList.remove('cal-day__month--previous');
    this.bodyDivs[index].classList.contains('cal-day__month--current') &&
      this.bodyDivs[index].classList.remove('cal-day__month--current');
    this.bodyDivs[index].classList.contains('cal-day__day--today') &&
      this.bodyDivs[index].classList.remove('cal-day__day--today');
    this.bodyDivs[index].classList.contains('dateBooked') &&
      this.bodyDivs[index].classList.remove('dateBooked');
    if (selected) {
      this.bodyDivs[index].classList.contains('cal-day__day--selected') &&
        this.bodyDivs[index].classList.remove('cal-day__day--selected');
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './book-slot-dialog.html',
  styleUrls: ['./book-slot-dialog.css'],
})
export class BookDialog implements OnInit {
  book = false;
  constructor(
    public dialogRef: MatDialogRef<BookDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    if (this.data.availability > 0) {
      this.book = true;
    } else {
      this.book = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  bookSlot() {
    console.log('book slot');
    this.dialogRef.close();
  }
}
