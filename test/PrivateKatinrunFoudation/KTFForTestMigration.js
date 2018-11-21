const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol")
const KTFForTestMigration = artifacts.require("./KTFForTestMigration.sol")

const BigNumber = require('bignumber.js');


contract("PrivateKatinrunFoudation", async (accounts) => {
  let pktf
  let ktf
  let owner
  let user1
  let user2
  let user3
  let expectedTotalSupply = BigNumber('0')
  let expectedTokenHolders = BigNumber('0')

  let expectedOwnerBalance = BigNumber('0')
  let expectedUser1 = BigNumber('0')
  let expectedUser2 = BigNumber('0')
  let expectedUser3 = BigNumber('0')

  before('Init', async() => {
    pktf = await PrivateKatinrunFoudation.deployed()
    ktf = await KTFForTestMigration.deployed()
    owner = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]
    user3 = accounts[3]
  })

  async function mintTo(user, amount) {
    // Minting
    await pktf.mint(
      user,
      amount,
      {from: owner}
    )
  }

  async function verifyBalance(user, expectedBalance) {
    const balance = await pktf.balanceOf(user)
    assert.equal(balance.toString(10), expectedBalance, `Balance should be ${expectedBalance}`)
  }

  async function verifyTotalSupply() {
    const totalSupply = await pktf.totalSupply()
    const expectedTotalSupplyStrig = web3.utils.toWei(expectedTotalSupply.toString(10), "ether")
    // console.log(`expectedTotalSupply ${expectedTotalSupplyStrig}`)
    // console.log(`totalSupply ${totalSupply.toString(10)}`)
    assert.equal(totalSupply.toString(10), expectedTotalSupplyStrig, `Total supply should be ${expectedTotalSupplyStrig}`)
  }

  async function verifyTokenHolders() {
    const numberOfTokenHolders = await pktf.numberOfTokenHolders()
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

      expectedOwnerBalance = web3.utils.toWei('3298132533531567', "ether")
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

      expectedUser1 = web3.utils.toWei('3892389219833893982', "ether")
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

      expectedUser2 = web3.utils.toWei('439329321329038', "ether")
    })
  })

  describe('Mint to user3', async() => {
    it("Mint to user3 #1", async() => {
      const amountToMint = web3.utils.toWei('10000000', "ether")
      expectedTotalSupply = expectedTotalSupply.plus(BigNumber('10000000'))
      await mintTo(user3, amountToMint)
      await verifyBalance(user3, web3.utils.toWei('10000000', "ether"))
      await verifyTotalSupply()

      expectedUser3 = web3.utils.toWei('10000000', "ether")
    })
  })

  describe('Migrate PKTF => KTF', async() => {
    it('Freeze', async() => {
      await pktf.freeze(
        {from: owner}
      )
    })

    it('Migrate', async() => {
      await ktf.migrateFromPKTF(
        {from: owner}
      )
    })

    describe('Verify', async() => {
      it('Number of token Holders', async() => {
        const pktfNumberOfTokenHolders = await pktf.numberOfTokenHolders()
        const ktfNumberOfTokenHolders = await ktf.holderCount()
  
        assert.equal(pktfNumberOfTokenHolders.toString(10), ktfNumberOfTokenHolders.toString(10), `Wrong token holders count`)
      })

      it('Balances', async() => {
        const ownerBalance = await ktf.balanceOf(owner)
        const user1Balance = await ktf.balanceOf(user1)
        const user2Balance = await ktf.balanceOf(user2)
        const user3Balance = await ktf.balanceOf(user3)

        assert.equal(expectedOwnerBalance.toString(10), ownerBalance.toString(10), `Owner balance is not equal for owner`)
        assert.equal(expectedUser1.toString(10), user1Balance.toString(10), `User1 balance is not equal for owner`)
        assert.equal(expectedUser2.toString(10), user2Balance.toString(10), `User2 balance is not equal for owner`)
        assert.equal(expectedUser3.toString(10), user3Balance.toString(10), `User3 balance is not equal for owner`)
      })

      it('Total Supply', async() => {
        const ktfTotalSupply = await ktf.totalSupply()
        const pktfTotalSupply = await pktf.totalSupply()

        assert.equal(ktfTotalSupply.toString(10), pktfTotalSupply.toString(10), `Total supply must be equal`)
      })
    })
  })
})
