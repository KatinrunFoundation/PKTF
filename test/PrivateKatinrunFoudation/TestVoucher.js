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

  // it("Voucher #1", async () => {
  //   const runnigNumber = 1
  //   const amount = 2000
  //   // const expired = await instance.expireTomorrow() 
  //   const expired = 1542957703 // Valid
  //   // const expired = 1542871529 // Voucher's expired
  //   const parity = '1xSafd'
  //   const receiver = user1
  //   const socialHash = user1

  //   const msgToSign = 'running:' + runnigNumber.toString() + ' Voucher for ' + amount.toString() + ' Expired ' + expired.toString() + ' Parity ' + parity
  //   console.log(`msg length: ${msgToSign.length}`)
  //   const msgLength = msgToSign.length

  //   // Valid
  //   const signature = {
  //     v: 28,
  //     r: '0x55ef1b7e27428679a6e4099ae40b3065b4fdb2fd24245a73adf10b72ae0994a3',
  //     s: '0x6de6187c3fee4eb77447459883c7070e3e10fbaba34d12ea991173e753242916'
  //   }

  //   // Voucher's expired
  //   // const signature = {
  //   //   v: 27,
  //   //   r: '0x14436306a3a37975e1629e73081a50acad137eb6341b5c7845ceb72036b5fd63',
  //   //   s: '0x73e142c17fbdd0f7b4956cdd63b7aba488b2ee35e1628877e9148bdc782a5235'
  //   // }

  //   let balanceBefore = await instance.balanceOf(receiver)
  //   console.log(`balanceBefore ${balanceBefore}`)

  //   const hashMsg = await instance.redeemVoucher(
  //     signature.v, 
  //     web3.eth.abi.encodeParameter('bytes32', signature.r),
  //     web3.eth.abi.encodeParameter('bytes32', signature.s),
  //     msgLength.toString(),
  //     runnigNumber.toString(),
  //     amount.toString(), 
  //     expired.toString(),
  //     parity,
  //     receiver,
  //     socialHash,
  //     {from: owner}
  //   )  

  //   let balanceAfter = await instance.balanceOf(receiver)
  //   console.log(`balanceAfter ${balanceAfter}`)

  //   assert.equal(balanceAfter.toString(10), parseInt(balanceBefore) + amount, "Redeption failed, balace's not updated")

  //   expectedTokenHolders += 1
  //   await verifyTokenHolders()
  // })
})