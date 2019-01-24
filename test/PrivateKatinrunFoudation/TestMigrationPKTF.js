const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol")
// const KTFForTestMigration = artifacts.require("./KTFForTestMigration.sol")

const BigNumber = require('bignumber.js');


contract("PrivateKatinrunFoudation", async (accounts) => {
    let pktf;
    let newpktf;
    let owner;
    let user1;
    let user2;
    let user3;
    let amount1;
    let amount2;
    let amount3;
    let oldBalance1;
    let oldBalance2;
    let oldBalance3;

    async function verifyBalance(contract, user, expectedBalance) {
        const balance = await contract.balanceOf(user)
        assert.equal(balance.toString(10), expectedBalance, `Balance should be ${expectedBalance}`)
    }

    before('Init', async () => {
        owner = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        amount1 = web3.utils.toWei('2000', 'ether')
        amount2 = web3.utils.toWei('3000', 'ether')
        amount3 = web3.utils.toWei('4000', 'ether')
        pktf = await PrivateKatinrunFoudation.deployed()

        // console.log('Old contract address', pktf.address);

        await pktf.mint(
            user1,
            amount1, {
                from: owner
            }
        )
        await pktf.mint(
            user2,
            amount2, {
                from: owner
            }
        )
        await pktf.mint(
            user3,
            amount3, {
                from: owner
            }
        )

        oldBalance1 = web3.utils.fromWei(await pktf.balanceOf(user1), 'ether')
        oldBalance2 = web3.utils.fromWei(await pktf.balanceOf(user2), 'ether')
        oldBalance3 = web3.utils.fromWei(await pktf.balanceOf(user3), 'ether')

        // console.log('balance1', balance1)
        // console.log('balance2', balance2)
        // console.log('balance3', balance3)        
    })

    describe('Test migration', async () => {
        it("Deploy new contract and migrate", async () => {
            newpktf = await PrivateKatinrunFoudation.new(pktf.address, {
                from: owner
            });
            // console.log('New contract address', newpktf.address);
        })

        it("Check holder balance", async () => {
            newBalance1 = web3.utils.fromWei(await newpktf.balanceOf(user1), 'ether')
            newBalance2 = web3.utils.fromWei(await newpktf.balanceOf(user2), 'ether')
            newBalance3 = web3.utils.fromWei(await newpktf.balanceOf(user3), 'ether')

            // console.log('newBalance1', newBalance1)
            // console.log('newBalance2', newBalance2)
            // console.log('newBalance3', newBalance3)

            verifyBalance(newpktf, user1, oldBalance1)
            verifyBalance(newpktf, user2, oldBalance2)
            verifyBalance(newpktf, user3, oldBalance3)
        })
    })
})
