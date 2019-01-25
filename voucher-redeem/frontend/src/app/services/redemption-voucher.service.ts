import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class RedemptionVoucherService {

    private paramBean = new BehaviorSubject<any>({});
    public getParam = this.paramBean.asObservable();

    constructor(
        private http: HttpClient
    ) { }

    passParameter(params: any) {
        this.paramBean.next(params);
    }

    getVoucher(redeemCode): Observable<any> {
        return this.http.get(`${environment.endpoint}/voucher/getVoucher/${redeemCode}/code`)
    }

    redeemVoucher(voucherParam): Observable<any> {
        return this.http.post(`${environment.endpoint}/voucher/redeemVoucher`, voucherParam)
    }
}
