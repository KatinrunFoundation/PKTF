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
      intVoucherId: 337025385313,
      parity: 6276567067,
      signature: {
        r: '0x899acf7c83959dd9dc3adf7c4221c84d4df06246270064fd2439ae838d8fe50a',
        s: '0x3af3e95999249e83f63ded3457c7366ecf300bf7bdeebd9b1691d7d17480884f',
        v: 28
      },
      msgLen: 39,
    }

    const receiver = user1
    const socialHash = user1

    const result = await instance.redeemVoucher(
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
      {
        from: owner
      }
    )

    console.log('hashMsg:', result.tx);

    assert.ok(result);

  })
})
