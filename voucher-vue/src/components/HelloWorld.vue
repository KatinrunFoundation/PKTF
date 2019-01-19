<template>
  <div class="hello">
    <h1>Create Voucher</h1>
    <label>Running</label>
    <input v-model="voucherRunning" />
    <br />
    <br />
    <label>Amount</label>
    <input v-model="voucherAmount" />
    <br />
    <br />
    <label>Expired</label>
    <input v-model="voucherExpired" />
    <br />
    <br />
    <label>Parity</label>
    <input v-model="voucherParity" />
    <br />
    <br />
    length: {{ msgLength }}
    <br />
    <button class="sign-button" @click="signVoucher">Sign</button>
  </div>
</template>

<script>
import Web3 from 'web3'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      property: 'Blank',
      web3: null,
      ownerAddr: null,
      voucherRunning: '1',
      voucherAmount: '2000',
      voucherExpired: '212121212',
      voucherParity: '1xSafd',
      msgToSign: '',
      msgLength: 0
    }
  },
  computed: {
    propertyComputed () {
      console.log('I change when this.property changes.')
      return this.property
    }
  },
  async created () {
    this.web3 = new Web3(window.web3.currentProvider)
    const accounts = await this.web3.eth.getAccounts()
    this.ownerAddr = accounts[0]
    console.log(`ownerAddr ${this.ownerAddr}`)

    this.property = 'Example property update.'
    console.log('propertyComputed will update, as this.property is now reactive.')
  },
  methods: {
    async sign () {
      // console.log(window.web3.version)
      // console.log(this.web3.version)

      var msg = 'Change Mint Manager to 0x7ff0F1919424F0D2B6A109E3139ae0f1d836D468 Expired 1527916874'
      // var msg = "Change Mint Manager to" + "0x7ff0F1919424F0D2B6A109E3139ae0f1d836D468" +"expired" + "123";
      // var hexFunc = this.web3.utils.sha3
      // var hexFunc = web3.toHex

      this.web3.eth.personal.sign(msg, this.ownerAddr).then(sig => {
        console.log(`sig ${sig}`)

        const r = sig.slice(0, 66)
        const s = '0x' + sig.slice(66, 130)
        let v = '0x' + sig.slice(130, 132)
        v = this.web3.utils.toDecimal(v)

        console.log('r: ' + r)
        console.log('s: ' + s)
        console.log('v: ' + v)
        // var ethereumMsg = "\x19Ethereum Signed Message:\n" + msg.length + msg;
        // console.log('msg hash: ' + hexFunc(ethereumMsg))
        // this.web3.eth.personal.ecRecover(hexFunc(msg), sig).then( addr => {
        //     console.log('recover addr: ' + addr)
        // });
      })
    },

    async signVoucher () {
      // console.log(window.web3.version)
      // console.log(this.web3.version)

      const runnigNumber = this.voucherRunning
      const amount = this.voucherAmount
      const expired = this.voucherExpired
      const parity = this.voucherParity
      this.msgToSign = 'running:' + runnigNumber + ' Voucher for ' + amount + ' Expired ' + expired + ' Parity ' + parity
      console.log(`msg length: ${this.msgToSign.length}`)
      this.msgLength = this.msgToSign.length

      // var msg = "Change Mint Manager to" + "0x7ff0F1919424F0D2B6A109E3139ae0f1d836D468" +"expired" + "123";
      // var hexFunc = this.web3.utils.sha3
      // var hexFunc = web3.toHex

      this.web3.eth.personal.sign(this.msgToSign, this.ownerAddr).then(sig => {
        console.log(`sig ${sig}`)

        const r = sig.slice(0, 66)
        const s = '0x' + sig.slice(66, 130)
        let v = '0x' + sig.slice(130, 132)
        v = this.web3.utils.toDecimal(v)

        console.log('r: ' + r)
        console.log('s: ' + s)
        console.log('v: ' + v)
        // var ethereumMsg = "\x19Ethereum Signed Message:\n" + msg.length + msg;
        // console.log('msg hash: ' + hexFunc(ethereumMsg))
        // this.web3.eth.personal.ecRecover(hexFunc(msg), sig).then( addr => {
        //     console.log('recover addr: ' + addr)
        // });
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
label {
  font-size: 20px;
  margin-right: 20px;
}
input {
  font-size: 20px;
}
.sign-button {
  font-size: 30px;
  border-radius: 14px;
  padding: 10px 76px;
}
</style>
