import {Component, OnDestroy, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {IUser} from './IUser';
import {catchError} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {NotificationService} from '../notification.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private router: Router,
              private notificationService: NotificationService) {
  }

  loading: boolean = false;

  users: IUser[] = [];

  userCreation: boolean = false;

  newUsername: String = '';

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.subscriptions.push(this.http.get(`${environment.api}/users`, {headers: this.getAuthorizationHeader()})
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(data => {
        this.users = [];
        Object.entries(data).forEach((key) => this.users.push({username: key[0], active: key[1]}));
        this.loading = false;
      }));
  }

  deleteUser(username: String) {
    this.loading = true;
    this.subscriptions.push(this.http.delete(`${environment.api}/users/${username}`, {headers: this.getAuthorizationHeader()})
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(this.loadUsers.bind(this)));
  }

  toggleUser(username: String, active: boolean) {
    this.loading = true;
    this.subscriptions.push(this.http.put(`${environment.api}/users/${username}?active=${active}`, {}, {headers: this.getAuthorizationHeader()})
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(this.loadUsers.bind(this)));
  }

  createNewUser() {
    this.loading = true;
    this.subscriptions.push(this.http.post(`${environment.api}/users`, this.newUsername, {headers: this.getAuthorizationHeader()})
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.newUsername = '';
        this.userCreation = false;
        this.loadUsers();
      }));
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    if (error.status === 401) {
      this.logout();
    } else {
      this.notificationService.addNotification('Ups, something went wrong. Please try again later.')
    }
    return throwError(() => error);
  }

  private getAuthorizationHeader() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.cookieService.get(environment.cookie.jwt)}`);
  }

  logout() {
    this.cookieService.delete(environment.cookie.jwt);
    this.router.navigateByUrl('login');
  }

  toggleUserCreation() {
    this.userCreation = !this.userCreation;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
