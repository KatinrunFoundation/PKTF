const PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol");
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

contract("PrivateKatinrunFoudation", async (accounts) => {
  let instance;
  let owner;
  let user1;
  let expectedTokenHolders = 0;

  const verifyTokenHolders = async () => {
    const numberOfTokenHolders = await instance.numberOfTokenHolders();
    assert.equal(numberOfTokenHolders.toString(10), expectedTokenHolders.toString(10), `Holders count should be ${expectedTokenHolders.toString(10)}`);
  }

  const generateRandomString = () => {
    let random = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
      random += possible.charAt(Math.floor(Math.random() * possible.length));
    return random;
  }

  const randomAmount = () => Math.floor((Math.random() * 1000000) + 2000);

  const abiEncodePacked = (voucherId, parity, amount, expire) => {
    const padZeros = (bytes, numBit) => {
      const pad = (b, maxBytes) => (b.length < maxBytes) ? pad('0'+b, maxBytes):b
      return pad(bytes, numBit >> 2);
    };
    return '0x' + padZeros(string2Hex(voucherId), 64) 
    + padZeros(string2Hex(parity), 64) 
    + padZeros(amount.toString(16), 256) 
    + padZeros(expire.toString(16), 256);
  }

  const string2Hex = (s) => {
    let str = '';
    for (var i = 0; i < s.length; i++) {
      str += s[i].charCodeAt(0).toString(16);
    }
    return str;
  }

  const string2Decimal = (s) => web3.utils.toDecimal('0x' + string2Hex(s));

  const randVoucherParams = () => ({voucherId: generateRandomString(),
    parity: generateRandomString(),
    amount: randomAmount(),
    expire: Math.floor(Date.now() / 1000) + 86400
  });

  before('Init', async() => {
    instance = await PrivateKatinrunFoudation.deployed()
    owner = accounts[0]
    user1 = accounts[1]

    console.log(`owner ${owner}`)
    console.log(`user1 ${user1}`)

    // const expireTomorrow = await instance.expireTomorrow()
    // console.log(`expireTomorrow ${expireTomorrow}`)

    // const expireNow = await instance.expireNow()
    // console.log(`expireNow ${expireNow}`)
  })

  it("Voucher #claim then claim again", async () => {
    const mockData = {
      ...(randVoucherParams()),
      receiver: user1,
      socialHash: web3.utils.keccak256(user1),
    };

    const msg = abiEncodePacked(mockData.voucherId, mockData.parity, mockData.amount, mockData.expire);

    const signature = await web3.eth.sign(msg, owner);

    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = 27 + web3.utils.toDecimal('0x' + signature.slice(130, 132));

    assert.ok(signature);

    const result = await instance.redeemVoucher(
      v, r, s,
      string2Decimal(mockData.voucherId),
      string2Decimal(mockData.parity),
      mockData.amount,
      mockData.expire,
      mockData.receiver,
      mockData.socialHash,
      {
        from: user1
      }
    )

    assert.ok(result);

    //try to claim again
    await shouldFail.reverting(instance.redeemVoucher(
      v, r, s,
      string2Decimal(mockData.voucherId),
      string2Decimal(mockData.parity),
      mockData.amount,
      mockData.expire,
      mockData.receiver,
      mockData.socialHash,
      {
        from: owner
      }
    ));
  })

  it("Voucher #voucher has expired", async () => {
    const mockData = {
      ...(randVoucherParams()),
      expire: Math.floor(Date.now() / 1000) - 86400,
      receiver: user1,
      socialHash: web3.utils.keccak256(user1),
    };

    const msg = abiEncodePacked(mockData.voucherId, mockData.parity, mockData.amount, mockData.expire);

    const signature = await web3.eth.sign(msg, owner);

    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = 27 + web3.utils.toDecimal('0x' + signature.slice(130, 132));

    assert.ok(signature);

    await shouldFail.reverting(instance.redeemVoucher(
      v, r, s,
      string2Decimal(mockData.voucherId),
      string2Decimal(mockData.parity),
      mockData.amount,
      mockData.expire,
      mockData.receiver,
      mockData.socialHash,
      {
        from: owner
      }
    ));
  })

  it("Voucher #incorrect voucherId , parity , amount", async () => {
    const mockData = {
      ...(randVoucherParams()),
      receiver: user1,
      socialHash: web3.utils.keccak256(user1),
    };

    const msg = abiEncodePacked(mockData.voucherId, mockData.parity, mockData.amount, mockData.expire);

    const signature = await web3.eth.sign(msg, owner);

    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = 27 + web3.utils.toDecimal('0x' + signature.slice(130, 132));

    assert.ok(signature);

    for (let i = 0; i < 10; i++) {
      const [rVoucherId, rParity, rAmount] = [generateRandomString(),generateRandomString(),randomAmount()];
      if (rVoucherId !== mockData.voucherId || rParity !== mockData.parity || rAmount !== mockData.amount) {
        await shouldFail.reverting(instance.redeemVoucher(
          v, r, s,
          string2Decimal(rVoucherId),
          string2Decimal(rParity),
          rAmount,
          mockData.expire,
          mockData.receiver,
          mockData.socialHash,
          {
            from: owner
          }
        ));
      }
    }
  })
})
