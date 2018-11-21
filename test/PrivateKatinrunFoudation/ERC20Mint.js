const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol")

contract("PrivateKatinrunFoudation", accounts => {
  let instance
  let owner
  let user1
  let user2

  before('Init', async() => {
    instance = await PrivateKatinrunFoudation.deployed()
    owner = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]
  })

  describe('Mint to owner', async() => {
    it("Mint to owner #1", async() => {
      // Allow exchange
      await instance.mint(
        owner,
        web3.toWei(1000000, "ether"),
        {from: owner}
      )
      console.log(`Mint 1000000 to owner (${owner})`)
  
      // Verify amount remainig
      
      let balance = await instance.balanceOf.call(
        owner
      )
      assert.equal(balance.toString(10), web3.toWei(1000000, "ether"), "Balance should be 1000000")
      
    })
  })
})
