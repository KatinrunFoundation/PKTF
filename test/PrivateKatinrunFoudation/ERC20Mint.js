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

  async function verifyBalance(user, expectedBalance) {
    let balance = await instance.balanceOf.call(user)
    assert.equal(balance.toString(10), expectedBalance, `Balance should be ${expectedBalance}`)
  }

  describe('Mint to owner', async() => {
    it("Mint to owner #1", async() => {
      const amountToMint = web3.toWei(1000000, "ether") 
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, amountToMint)
    })

    it("Mint to owner #2", async() => {
      const amountToMint = web3.toWei(10000000000, "ether")
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.toWei(10001000000, "ether"))
    })

    it("Mint to owner #3", async() => {
      const amountToMint = web3.toWei(4829329328329, "ether")
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.toWei(4839330328329, "ether"))
    })

    it("Mint to owner #4", async() => {
      const amountToMint = web3.toWei(3293293203203238, "ether")
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.toWei(3298132533531567, "ether"))
    })
  })

  describe('Mint to user1', async() => {
    it("Mint to user1 #1", async() => {
      const amountToMint = web3.toWei(1000000, "ether") 
      await mintTo(user1, amountToMint)
      await verifyBalance(user1, amountToMint)
    })

    it("Mint to user1 #2", async() => {
      const amountToMint = web3.toWei(3892389219832893982, "ether")
      await mintTo(user1, amountToMint)
      await verifyBalance(user1, web3.toWei(3892389219833893982, "ether"))
    })
  })

  describe('Mint to user2', async() => {
    it("Mint to user2 #1", async() => {
      const amountToMint = web3.toWei(1000000, "ether") 
      await mintTo(user2, amountToMint)
      await verifyBalance(user2, amountToMint)
    })

    it("Mint to user2 #2", async() => {
      const amountToMint = web3.toWei(439329320329038, "ether")
      await mintTo(user2, amountToMint)
      await verifyBalance(user2, web3.toWei(439329321329038, "ether"))
    })
  })
})
