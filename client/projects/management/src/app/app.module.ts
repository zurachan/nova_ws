import { JwtInterceptor } from './shared/services/http-interceptor/jwt-interceptor';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { UnauthenticatedComponent } from './layout/unauthenticated/unauthenticated.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { PreloaderComponent } from './layout/preloader/preloader.component';
import { LoginComponent } from './layout/login/login.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
// import { DeleteConfirmComponent } from './shared/component/delete-confirm/delete-confirm.component';
import { ContentComponent } from './page/content/content.component';
import { CustomerComponent } from './page/customer/customer.component';
import { EventComponent } from './page/event/event.component';
import { PartnerComponent } from './page/partner/partner.component';
import { ProjectComponent } from './page/project/project.component';
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 10,
    },
    vertical: {
      position: 'top',
      distance: 10,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 2000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};


@NgModule({
  exports: [
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidenavComponent,
    PreloaderComponent,
    UnauthenticatedComponent,
    LoginComponent,
    // DeleteConfirmComponent,
    ContentComponent,
    CustomerComponent,
    EventComponent,
    PartnerComponent,
    ProjectComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          if (
            localStorage.getItem('token') == null ||
            localStorage.getItem('token') == undefined
          ) {
            return 'a';
          }
          return JSON.parse(localStorage.getItem('token'))['token'];
        },
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }



