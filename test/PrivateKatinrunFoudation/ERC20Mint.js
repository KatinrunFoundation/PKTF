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

  async function mintTo(user, amount) {
    // Minting
    await instance.mint(
      user,
      amount,
      {from: owner}
    )
  }

  async function balanceOf(user) {
    return await instance.balanceOf.call(owner)
  }

  describe('Mint to owner', async() => {
    it("Mint to owner #1", async() => {
      const amountToMint = web3.toWei(1000000, "ether") 
      await mintTo(owner, amountToMint)
  
      // Verify amount remainig
      let balance = await balanceOf(owner)
      assert.equal(balance.toString(10), amountToMint, "Balance should be 1000000")
    })

    it("Mint to owner #2", async() => {
      const amountToMint = web3.toWei(10000000000, "ether")
      await mintTo(owner, amountToMint)
  
      // Verify amount remainig
      let balance = await balanceOf(owner)
      assert.equal(balance.toString(10), web3.toWei(10001000000, "ether"), "Balance should be 10001000000")
    })

    it("Mint to owner #3", async() => {
      const amountToMint = web3.toWei(4829329328329, "ether")
      await mintTo(owner, amountToMint)
  
      // Verify amount remainig
      let balance = await balanceOf(owner)
      assert.equal(balance.toString(10), web3.toWei(4839330328329, "ether"), "Balance should be 10001000000")
    })
  })
})
