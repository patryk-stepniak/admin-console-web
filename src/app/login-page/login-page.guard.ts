import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginPageGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.cookieService.get(environment.cookie.jwt)) {
      this.router.navigateByUrl('dashboard');
      return false;
    } else {
      return true;
    }
  }

}
