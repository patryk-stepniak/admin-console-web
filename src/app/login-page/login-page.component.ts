import {Component, OnDestroy} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subscription, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from "@angular/router";
import {NotificationService} from "../notification.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnDestroy {

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private router: Router,
              private notificationService: NotificationService) {
  }

  validationError = {
    username: '',
    password: '',
  };

  loading: boolean = false;

  username: String = '';
  password: String = '';

  private subscriptions: Subscription[] = [];

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.notificationService.addNotification('Invalid credentials. Please check your login and password.');
    } else {
      this.notificationService.addNotification('Ups, something went wrong. Please try again later.');
    }
    this.loading = false;
    return throwError(() => error);
  }

  login() {
    this.validationError.username = this.username ? '' : 'Username cannot be empty!';
    this.validationError.password = this.password ? '' : 'Password cannot be empty!';

    if (!this.validationError.username && !this.validationError.password) {
      this.loading = true;
      this.subscriptions.push(this.http.post(`${environment.api}/login`, {
        'username': this.username,
        'password': this.password
      }, {responseType: 'text'})
        .pipe(
          catchError(this.handleError.bind(this))
        )
        .subscribe(token => {
          this.cookieService.set(environment.cookie.jwt, token.toString());
          this.router.navigateByUrl('dashboard');
        }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
