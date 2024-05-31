import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './layout/error/error.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './layout/login/login.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { UnauthenticatedComponent } from './layout/unauthenticated/unauthenticated.component';
import { ContentDetailComponent } from './page/content/content-detail/content-detail.component';
import { ContentComponent } from './page/content/content.component';
import { CustomerDetailComponent } from './page/customer/customer-detail/customer-detail.component';
import { CustomerComponent } from './page/customer/customer.component';
import { EventDetailComponent } from './page/event/event-detail/event-detail.component';
import { EventComponent } from './page/event/event.component';
import { PartnerDetailComponent } from './page/partner/partner-detail/partner-detail.component';
import { PartnerComponent } from './page/partner/partner.component';
import { ProjectDetailComponent } from './page/project/project-detail/project-detail.component';
import { ProjectComponent } from './page/project/project.component';
import { DeleteConfirmModule } from './shared/component/delete-confirm/delete-confirm.module';
import { PaginationModule } from './shared/component/pagination/pagination.module';
import { JwtInterceptor } from './shared/services/http-interceptor/jwt-interceptor';
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
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidenavComponent,
    UnauthenticatedComponent,
    LoginComponent,
    ContentComponent,
    ContentDetailComponent,
    CustomerComponent,
    CustomerDetailComponent,
    EventComponent,
    EventDetailComponent,
    PartnerComponent,
    PartnerDetailComponent,
    ProjectComponent,
    ProjectDetailComponent,
    ProfileComponent,
    ErrorComponent,
    HomeComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NotifierModule.withConfig(customNotifierOptions),

    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          if (
            localStorage.getItem('credential') == null ||
            localStorage.getItem('credential') == undefined
          ) {
            return 'a';
          }
          return JSON.parse(localStorage.getItem('credential'))['token'];
        },
      },
    }),
    
    PaginationModule,
    DeleteConfirmModule,
    NgxSummernoteModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }



