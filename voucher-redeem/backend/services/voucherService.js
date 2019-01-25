const admin = require('firebase-admin');
const walletService =require("./walletService")
const voucherModel = require('../models/voucher')
const serviceAccount = require("[SERVICE ACCOUNT FROM FIREBASE]");

const dateFns = require('date-fns')
const util = require('../util')

const redeemedVoucher = {
    socialType: "",
    socialId: "",
    transactionId: "",
    redeemDtm:"",
    ...voucherModel
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//----- Direction create voucher
//-----     - get random voucher id
//-----     - check duplicate voucher id
//-----     - create voucher with current running number set status to N = Normal
//-----     - save voucher
//---------------------------------------------------------------------------------------------------
getRandomVoucherId = async () => {
    for(let r = 0; r <= 10; r++){ //---- prevent infinite loop
        const voucherId = util.makeRandomId()
        const voucher = await db.collection('Vouchers').doc(voucherId).get()
        // console.log('voucherId: ', voucherId)
        if(!voucher.exists){
            return {
                voucherId: voucherId
            }
        }
    }
    throw new Error('Infinite loop!!')
}

saveVoucher = async (voucherParam) => {
    console.log(`Save voucher ${voucherParam}`);
    // let runningNumber = voucherParam.runningNumber;
    let voucherId = voucherParam.voucherId;
    let oldVoucher = await db.collection('Vouchers').doc(voucherId).get();
    if(!oldVoucher.data()){
        voucherModel.voucherId = voucherId
        voucherModel.amount = voucherParam.amount
        voucherModel.signature = voucherParam.signature
        voucherModel.expire = voucherParam.expire
        voucherModel.voucherStatus = "N"
        await db.collection('Vouchers').doc(voucherId).set(voucherModel)
        
        return {
            message:"success",
            voucherId: voucherId
        };
    }else{
        throw new Error('Found voucher duplicate')
    }
}

//----- Direction redeem voucher
//-----     - get login from github or facebook
//-----     - get wallet address
//-----     - if success, find voucher from voucher server
//-----     - if found, send voucher object to wallet server for redeem from blockchain
//-----     - set voucher status to redeeming
//-----     - show loading until transaction confirmed
//-----     - if transaction redeem successfull, delete voucher from voucherDB and insert to redemptionDB
//--------------------------------------------------------------------------------------------------------

getVoucher = async (voucherRedeemCode) => {
    console.log("get voucher: ", voucherRedeemCode)
    const voucherParamSplit = voucherRedeemCode.split("-");
    const voucherCode = voucherParamSplit[0];
    const voucherObj = await db.collection("Vouchers").doc(voucherCode).get();
    return voucherObj.data()
}

redeemVoucher = async (voucherParam) => {
    console.log("Redeem voucher", voucherParam);
    if(voucherParam){
        const voucherParamSplit = voucherParam.redeemCode.split("-");
        const voucherCode = voucherParamSplit[0];
        const parity = voucherParamSplit[1];
        const voucherObj = await db.collection("Vouchers").doc(voucherCode).get();
        if(voucherObj){
            try{
                let voucher = voucherObj.data();
                const socialId = voucherParam.socialId

                voucher.voucherStatus = "R";
                await db.collection("Vouchers").doc(voucherCode).set(voucher);

                voucher.address = voucherParam.address;
                voucher.parity = parity;
                voucher.socialId = socialId
                console.log("Voucher", voucher);
                let transactionId = await walletService.redeemVoucherFromBlockchain(voucher);

                redeemedVoucher.socialType = voucherParam.socialType
                redeemedVoucher.socialId = socialId
                redeemedVoucher.transactionId = transactionId
                redeemedVoucher.voucherId = voucher.voucherId
                redeemedVoucher.amount = voucher.amount
                redeemedVoucher.signature = voucher.signature
                redeemedVoucher.expire = voucher.expire
                redeemedVoucher.voucherStatus = voucher.voucherStatus
                redeemedVoucher.redeemDtm = dateFns.getTime(new Date())
                await db.collection('RedeemedVouchers').doc(voucherCode).set(redeemedVoucher);
                await db.collection('Vouchers').doc(voucherCode).delete();
                return {
                    message:"success",
                    transactionId:transactionId,
                    amount: voucher.amount
                }
            }catch(err){
                throw new Error(err);
            }
        }else{
            throw new Error("Voucher not found or voucher redeemed")
        }
    }else{
        throw new Error('Not found redeem code');
    }
}

module.exports = {
    saveVoucher,
    redeemVoucher,
    getRandomVoucherId,
    getVoucher
};