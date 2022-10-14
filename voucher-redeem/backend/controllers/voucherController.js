const express = require('express');
const voucherService = require('../services/voucherService');
const Web3 = require("web3");
const router = express.Router();
const config = require("../models/systemConfig")

router.get("/getRandomVoucherId", async (req, res) => {
    try{
        let randomVoucherId = await voucherService.getRandomVoucherId()
        res.send(randomVoucherId)
    }catch(err){
        console.log('catch error');
        console.error(err);
        res.status(err.status || 500);
        res.send({
            message: `Found error: ${err.message}`
        })
    }
})

router.get("/getVoucher/:redeemCode/code", async (req, res) => {
    try{
        let voucher = await voucherService.getVoucher(req.params.redeemCode);
        res.send(voucher);
    }catch(err){
        console.error(err);
        res.status(err.status || 500);
        res.send({
            message: `Found error: ${err.message}`
        })
    }
})

router.post("/saveVoucher", async (req, res) => {
    try{
        let resultSaveVoucher = await voucherService.saveVoucher(req.body);
        res.send(resultSaveVoucher);
    }catch(err){
        console.error(err);
        res.status(err.status || 500);
        res.send({
            message: `Found error: ${err.message}`
        })
    }
})

router.post("/redeemVoucher", async (req, res) => {
    try{
        let resultRedeemVoucher = await voucherService.redeemVoucher(req.body);
        res.send(resultRedeemVoucher);
    }catch(err){
        console.error(err);
        res.status(err.status || 500);
        res.send({
            message: `Found error: ${err.message}`
        })
    }
})


module.exports = router