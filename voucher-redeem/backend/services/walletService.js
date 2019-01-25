'user strict'
const config = require("../models/systemConfig")
const Web3 = require("web3");
const PrivateKatinrunFoudation = require("../abi/PrivateKatinrunFoudation");
const utils = require("../util")
const axios = require("axios");
const privateKey = require("../privateKey");

redeemVoucherFromBlockchain = async (voucherParam) => {
    const ethGas = await getDefaultEthGas();
    console.log("privateKey: ", privateKey.key);
    // console.log('ethGas: ', ethGas)
    const provider = new Web3.providers.HttpProvider(config.provider)
    const _web3 = new Web3(provider)
    const pktf = new _web3.eth.Contract(PrivateKatinrunFoudation.abi, config.pktfAddr)
    console.log(`Redeem voucher from blockchain`)
    try{
        let encoded = await pktf.methods.redeemVoucher(
            voucherParam.signature.v,
            voucherParam.signature.r,
            voucherParam.signature.s,
            Web3.utils.toDecimal('0x'+ utils.String2Hex(voucherParam.voucherId)),
            Web3.utils.toDecimal('0x'+ utils.String2Hex(voucherParam.parity)),
            voucherParam.amount,
            parseInt(voucherParam.expire),
            voucherParam.address,
            Web3.utils.keccak256(voucherParam.socialType+voucherParam.socialId)
        ).encodeABI();

        const tx = {
            to: config.pktfAddr,
            gas: 200000,
            gasPrice: ethGas,
            data: encoded
        }
        const signed = await _web3.eth.accounts.signTransaction(tx, privateKey.key)
        
        var result = await _web3.eth.sendSignedTransaction(signed.rawTransaction);
        // console.log("result: ", result);
        return result.transactionHash;
    }catch(err){
        console.error(err);
        throw new Error(err)

    }
}

getDefaultEthGas = async () => {
    const result = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    if(result){
        // console.log("result: ", result);
        const gasResult = result.data
        return gasResult.average*Math.pow(10,8)
    }else{
        return 0
    }
}



module.exports = {
    redeemVoucherFromBlockchain
}
