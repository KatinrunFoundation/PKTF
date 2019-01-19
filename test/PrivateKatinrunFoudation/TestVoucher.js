const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol")
const BigNumber = require('bignumber.js');

contract("PrivateKatinrunFoudation", async (accounts) => {
  let instance
  let owner
  let user1
  let expectedTokenHolders = 0

  async function verifyTokenHolders() {
    const numberOfTokenHolders = await instance.numberOfTokenHolders()
    assert.equal(numberOfTokenHolders.toString(10), expectedTokenHolders.toString(10), `Holders count should be ${expectedTokenHolders.toString(10)}`)
  }

  before('Init', async() => {
    instance = await PrivateKatinrunFoudation.deployed()
    owner = accounts[0]
    user1 = accounts[1]

    console.log(`owner ${owner}`)
    console.log(`user1 ${user1}`)

    const expireTomorrow = await instance.expireTomorrow()
    console.log(`expireTomorrow ${expireTomorrow}`)

    const expireNow = await instance.expireNow()
    console.log(`expireNow ${expireNow}`)
  })




  it("Voucher #1", async () => {
    const signed1 = {
      amount: 2000,
      expire: 1550509200,
      msgLen: 28,
      parity: 302615589956,
      signature: {
        r: "0x5df5081e29947497936c7e0277b499828e4d3a019b2b699d80935db028fb581f",
        s: "0x5bb74b68dddeee0c03c4081c88ca0a42b5a5a7e9f054892a321376b21f98dc00",
        v: 28
      },
      voucherId: "FuKtD",
      intVoucherId: 337025385313
    }

    // const amount = 2000
    // const expired = await instance.expireTomorrow() 
    // const expired = 1542957703 // Valid
    // const expired = 1542871529 // Voucher's expired
    // const parity = '1xSafd'
    const receiver = user1
    const socialHash = user1

    const msgToSign = '|5837454255|221097052228|2000|1550509200';
    console.log(`msg length: ${msgToSign.length}`)
    const msgLength = msgToSign.length

    // Valid
    const signature = {
      r: "0x1759ff69dc7594f12549bcf949c920d87bdda5d69d6a148861cca53fa97498f9",
      s: "0x4202bf119ddbbf1937d408998600bf3e185a0ec4b7063cfed43477355a2d729a",
      v: 27
    }


    let balanceBefore = await instance.balanceOf(receiver)
    console.log(`balanceBefore ${balanceBefore}`)

    console.log(signed1.signature.v, 
      web3.eth.abi.encodeParameter('bytes32', signed1.signature.r),
      web3.eth.abi.encodeParameter('bytes32', signed1.signature.s),
      signed1.intVoucherId,
      signed1.parity,
      signed1.amount, 
      signed1.expire,
      signed1.msgLen,
      receiver,
      socialHash)

    const hashMsg = await instance.redeemVoucher(
      signed1.signature.v, 
      web3.eth.abi.encodeParameter('bytes32', signed1.signature.r),
      web3.eth.abi.encodeParameter('bytes32', signed1.signature.s),
      signed1.intVoucherId,
      signed1.parity,
      signed1.amount, 
      signed1.expire,
      signed1.msgLen,
      receiver,
      socialHash,


      {from: owner}
    )

    console.log('hashMsg:', hashMsg);

    assert.ok(hashMsg);

    // let balanceAfter = await instance.balanceOf(receiver)
    // console.log(`balanceAfter ${balanceAfter}`)

    // assert.equal(balanceAfter.toString(10), parseInt(balanceBefore) + amount, "Redeption failed, balace's not updated")

    // expectedTokenHolders += 1
    // await verifyTokenHolders()
  })
})
