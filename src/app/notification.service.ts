import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {

  private message: Subject<string> = new BehaviorSubject<string>('');

  private timeout: number = 0;

  get notification() {
    return this.message.asObservable();
  }

  addNotification(message: string) {
    this.message.next(message);
    this.timeout = setTimeout(this.clearMessage.bind(this), 1500);
  }

  private clearMessage() {
    this.message.next('');
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

}
