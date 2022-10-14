import { environment } from './../environments/environment';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RedemptionVoucherService } from './services/redemption-voucher.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import * as Web3 from 'web3'
import swal from 'sweetalert2'
import * as dateFns from 'date-fns'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('ModalAuthenWithSocial')
  private modalAuthenWithSocial: ModalDirective

  public isShowRedeemFunction = true
  public isShowTransactionId = false
  public returnTransactionId = '0xabcd12345'
  public voucherAmount = 0
  public userLogedIn: any = {}
  public expire = ''
  public amount = 0
  public _web3: any
  public _account: any
  public waitingTime = ''
  public redeemParam = {
    redeemCode: '',
    socialType: '',
    socialId: '',
    address: ''
  }

  constructor(
    private afAuth: AngularFireAuth,
    private redemptionVoucherService: RedemptionVoucherService,
    private route: ActivatedRoute
  ) {
    if (typeof (<any>window).web3 !== 'undefined') {
      this._web3 = new Web3((<any>window).web3.currentProvider)
    }
  }

  async ngOnInit() {
    this.redeemParam.address = await this.getAccount()
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            (<any>swal).fire({
              type: 'error',
              title: 'There was an error fetching your accounts',
            })
            return;
          }

          if (accs.length === 0) {
            (<any>swal).fire({
              type: 'warning',
              title: 'Couldn\'t get any accounts! Please login your wallet (e.g: metaMask). and refresh page',
            })
            return;
          }
          resolve(accs[0]);
        })
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  async redeemVoucher() {
    if (this.redeemParam.redeemCode) {
      const result = await (<any>swal).fire({
        title: 'Confirm redeem voucher?',
        text: '',
        imageUrl: `${environment.endpointAssets}/assets/images/katin-logo.png`,
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<span class="pl-3 pr-3">Yes</span>',
        cancelButtonText: 'Cancel',
      })
      if (result.value) {
        // console.log('this.redeemParam: ', this.redeemParam)
        const voucher = await this.redemptionVoucherService.getVoucher(this.redeemParam.redeemCode).toPromise()
        if (!voucher) {
          (<any>swal).fire({
            type: 'error',
            title: 'Voucher invalid or redeemed',
            text: 'Please contact Katinrun staff'
          })
        } else {
          // this.modalAuthenWithSocial.show()
          if (voucher.voucherStatus === 'R') {
            (<any>swal).fire({
              title: '',
              text: 'Your redemption request is in progress. You can close this page and later check the status of PKTF token through your Ethereum Wallet.',
              imageUrl: `${environment.endpointAssets}/assets/images/katin-logo.png`,
              imageWidth: 100,
              imageHeight: 100,
            })
          } else {
            try {
              await this.doRedeemVoucher()
            } catch (redeemError) {
              console.error('Error redeem voucher', redeemError)
            }
          }
        }
      }
    } else {
      (<any>swal).fire({
        type: 'error',
        title: 'Please fill redeem code',
      })
    }
  }

  async doLoginWithSocial(type: string) {
    try {
      let provider: any
      switch (type) {
        case 'github' : provider = new firebase.auth.GithubAuthProvider()
                        break
        case 'facebook' : provider = new firebase.auth.FacebookAuthProvider()
                          break
      }
      const response = await this.afAuth.auth.signInWithPopup(provider);
      if (response) {
        // console.log('response: ', response)
        this.userLogedIn.token = (<any>response.credential).accessToken;
        // The signed-in user info.
        this.userLogedIn.user = response.user.providerData[0];
        // console.log('token: ', this.userLogedIn.token)
        // console.log('user: ', this.userLogedIn.user)
        this.modalAuthenWithSocial.hide()
        try {
          await this.doRedeemVoucher()
        } catch (redeemError) {
          console.error('Error redeem voucher', redeemError)
        }
      } else {
        throw new Error('Cannot Authenticate')
      }
    } catch (err) {
      console.error('Login with facebook found error: ', err)
    }
  }

  private async doRedeemVoucher() {
    // console.log('Redeem voucher')
    // if (this.userLogedIn.user) {
      // this.redeemParam.socialType = this.userLogedIn.user.providerId + ':' + this.userLogedIn.user.displayName + ':' + this.userLogedIn.user.email
      // this.redeemParam.socialId = this.userLogedIn.token
      // console.log('this.redeemParam: ', this.redeemParam)
      this.redeemParam.socialType = 'DUMMY-VALUE'
      this.redeemParam.socialId = 'DUMMY-VALUE'
      try {
        const result = await this.redemptionVoucherService.redeemVoucher(this.redeemParam).toPromise()
        if (result) {
          const successResult = await (<any>swal).fire({
            title: 'Success',
            text: 'Your redemption request is in queue',
            type: 'success'
          })
          if (successResult.value) {
            this.waitingTime = dateFns.format(dateFns.addSeconds(new Date(0), result.waitingTime), 'mm:ss');
            this.isShowRedeemFunction = false
            this.isShowTransactionId = true
            // this.returnTransactionId = result.transactionId
            // this.voucherAmount = result.amount
          }
          console.log('redeem success!!')
        }
      } catch (err) {
        (<any>swal).fire({
          type: 'error',
          title: 'Found error',
          text: 'Please contact Katinrun staff'
        })
      }
    // }
  }
}
