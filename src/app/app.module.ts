import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import {DashboardGuard} from './dashboard/dashboard.guard';
import {LoginPageGuard} from './login-page/login-page.guard';
import {FormsModule} from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent, canActivate: [LoginPageGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardComponent,
    SpinnerComponent,
  ],
    imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      FormsModule,
      HttpClientModule,
    ],
  providers: [
    CookieService,
    DashboardGuard,
    LoginPageGuard,
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule { }
