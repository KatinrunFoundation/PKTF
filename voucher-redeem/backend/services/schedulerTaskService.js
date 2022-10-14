const admin = require('firebase-admin');
const walletService =require("./walletService")
const dateFns = require('date-fns')
const voucherModel = require('../models/voucher')
const config = require('../models/systemConfig')

const db = admin.firestore();
const redeemedVoucher = {
    socialType: "",
    socialId: "",
    transactionId: "",
    redeemDtm:"",
    ...voucherModel
}

runTask = async () => {
    console.log("Task redeem voucher run")
    //----- Loop check queue size and fetch voucher for redeem
    db.collection("QueueVouchers").limit(1).get().then(
        (queueVouchers) => {
            if(queueVouchers._size > 0){
                queueVouchers.forEach((queueVoucher) => {
                    const voucher = queueVoucher.data()
                    console.log("voucher: ", voucher);
                    walletService.redeemVoucherFromBlockchain(voucher).then(
                        (transactionId) => {
                            redeemedVoucher.socialType = config.dummy
                            redeemedVoucher.socialId = config.dummy
                            redeemedVoucher.transactionId = transactionId
                            redeemedVoucher.voucherId = voucher.voucherId
                            redeemedVoucher.amount = voucher.amount
                            redeemedVoucher.signature = voucher.signature
                            redeemedVoucher.expire = voucher.expire
                            redeemedVoucher.voucherStatus = voucher.voucherStatus
                            redeemedVoucher.redeemDtm = dateFns.getTime(new Date())
                            db.collection('RedeemedVouchers').doc(voucherCode).set(redeemedVoucher);
                            db.collection('Vouchers').doc(voucherCode).delete();
                            db.collection("QueueVouchers").doc(queueVoucher.id).delete();
                        }
                    )
                });
            }else{
                console.log("Queue empty....")
            }
        }
    )
}

module.exports = {
    runTask
}
