import { Component } from '@angular/core';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  authenticationError: string = '';

  constructor(notificationService: NotificationService) {
    notificationService.notification.subscribe(error => this.authenticationError = error);
  }
}
