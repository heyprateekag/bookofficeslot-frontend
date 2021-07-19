import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  baseURL = 'https://bookmyofficeslotbackend.herokuapp.com/';
  // userDetails;

  constructor(private http: HttpClient, private route: Router) {}

  login(username, password): Observable<{}> {
    const url = this.baseURL + 'login/' + username + '/' + password;
    return this.http.get(url);
  }

  // setUserDetails(userDetails) {
  //   this.userDetails = userDetails;
  // }
  getAllUpdates() {
    const url = this.baseURL + 'updates';
    return this.http.get(url);
  }

  bookSlot(jsonObject): Observable<{}> {
    const url = this.baseURL + 'bookslot';
    return this.http.put(url, jsonObject, { responseType: 'text' });
  }

  getAvailableSlots(startDate, endDate) {
    const url = this.baseURL + 'availableslots/' + startDate + '/' + endDate;
    return this.http.get(url);
  }

  getBookedUsersForDate(date) {
    const url = this.baseURL + 'bookedusers/' + date;
    return this.http.get(url);
  }

  getBookedSlots(email) {
    const url = this.baseURL + 'bookedfor/' + email;
    return this.http.get(url);
  }

  cancelSlot(jsonObject) {
    const url = this.baseURL + 'cancelslot';
    return this.http.post(url, jsonObject, { responseType: 'text' });
  }

  getBookings(todaysdate) {
    const url = this.baseURL + 'bookings/' + todaysdate;
    return this.http.get(url);
  }

  //just for admin
  cancelBooking(id, reason, date) {
    const url =
      this.baseURL +
      'cancelbooking/' +
      parseInt(id) +
      '/' +
      reason +
      '/' +
      date;
    return this.http.get(url, { responseType: 'text' });
  }
}
