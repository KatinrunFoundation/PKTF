import { RedemptionVoucherService } from './services/redemption-voucher.service';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive } from '@angular/core';
import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'pktfRedemptionVoucher', pathMatch: 'full' },
      {
        path: 'pktfRedemptionVoucher', component: AppComponent
      }
    ], )
  ],
  providers: [
    RedemptionVoucherService,
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
