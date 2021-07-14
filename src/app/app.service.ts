import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  baseURL = 'http://localhost:8080/';
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
    return this.http.put(url, jsonObject);
  }

  getAvailableSlots(startDate, endDate){
    const url = this.baseURL + 'availableslots/'+startDate+'/'+endDate;
    return this.http.get(url);
  }
}
