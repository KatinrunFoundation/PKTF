const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol")
const BigNumber = require('bignumber.js');


contract("PrivateKatinrunFoudation", async (accounts) => {
  let instance
  let owner
  let user1
  let user2
  let expectedTotalSupply = BigNumber('0')
  let expectedTokenHolders = BigNumber('0')

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
    const balance = await instance.balanceOf(user)
    assert.equal(balance.toString(10), expectedBalance, `Balance should be ${expectedBalance}`)
  }

  async function verifyTotalSupply() {
    const totalSupply = await instance.totalSupply()
    const expectedTotalSupplyStrig = web3.utils.toWei(expectedTotalSupply.toString(10), "ether")
    // console.log(`expectedTotalSupply ${expectedTotalSupplyStrig}`)
    // console.log(`totalSupply ${totalSupply.toString(10)}`)
    assert.equal(totalSupply.toString(10), expectedTotalSupplyStrig, `Total supply should be ${expectedTotalSupplyStrig}`)
  }

  async function verifyTokenHolders() {
    const numberOfTokenHolders = await instance.numberOfTokenHolders()
    assert.equal(numberOfTokenHolders.toString(10), expectedTokenHolders.toString(10), `Holders count should be ${expectedTokenHolders.toString(10)}`)
  }

  describe('Mint to owner', async() => {
    it("Mint to owner #1", async() => {
      const amountToMint = web3.utils.toWei('1000000', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('1000000'))
      expectedTokenHolders = expectedTokenHolders.plus(BigNumber('1'))
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, amountToMint)
      await verifyTotalSupply()
      await verifyTokenHolders()
    })

    it("Mint to owner #2", async() => {
      const amountToMint = web3.utils.toWei('10000000000', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('10000000000'))
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.utils.toWei('10001000000', "ether"))
      await verifyTotalSupply()
    })

    it("Mint to owner #3", async() => {
      const amountToMint = web3.utils.toWei('4829329328329', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('4829329328329'))
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.utils.toWei('4839330328329', "ether"))
      await verifyTotalSupply()
    })

    it("Mint to owner #4", async() => {
      const amountToMint = web3.utils.toWei('3293293203203238', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('3293293203203238'))
      await mintTo(owner, amountToMint)
      await verifyBalance(owner, web3.utils.toWei('3298132533531567', "ether"))
      await verifyTotalSupply()
    })
  })

  describe('Mint to user1', async() => {
    it("Mint to user1 #1", async() => {
      const amountToMint = web3.utils.toWei('1000000', "ether") 
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('1000000'))
      expectedTokenHolders = expectedTokenHolders.plus(BigNumber('1'))
      await mintTo(user1, amountToMint)
      await verifyBalance(user1, amountToMint)
      await verifyTotalSupply()
      await verifyTokenHolders()
    })

    it("Mint to user1 #2", async() => {
      const amountToMint = web3.utils.toWei('3892389219832893982', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('3892389219832893982'))
      await mintTo(user1, amountToMint)
      await verifyBalance(user1, web3.utils.toWei('3892389219833893982', "ether"))
      await verifyTotalSupply()
    })
  })

  describe('Mint to user2', async() => {
    it("Mint to user2 #1", async() => {
      const amountToMint = web3.utils.toWei('1000000', "ether") 
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('1000000'))
      expectedTokenHolders = expectedTokenHolders.plus(BigNumber('1'))
      await mintTo(user2, amountToMint)
      await verifyBalance(user2, amountToMint)
      await verifyTotalSupply()
      await verifyTokenHolders()
    })

    it("Mint to user2 #2", async() => {
      const amountToMint = web3.utils.toWei('439329320329038', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('439329320329038'))
      await mintTo(user2, amountToMint)
      await verifyBalance(user2, web3.utils.toWei('439329321329038', "ether"))
      await verifyTotalSupply()
    })
  })
})
