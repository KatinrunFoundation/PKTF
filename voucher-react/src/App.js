import React, { Component } from "react";
import { post } from 'axios';
import * as moment from 'moment';
import Web3 from 'web3';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  TextArea,
  Divider,
} from "semantic-ui-react";
import {
  DateInput
  // TimeInput,
  // DateTimeInput,
  // DatesRangeInput
} from "semantic-ui-calendar-react";
import "./App.css";
import example_voucher from "./images/example_voucher.png";
import QRCode from 'qrcode.react';

class App extends Component {
  state = {
    voucherId: '',
    intVoucherId: 0,
    intParity: 0,
    amount: 2000,
    expireDate: '',
    parity: '',
    date: '',
    dateUnix: '',
    dateTime: '',
    datesRange: '',
    web3: {},
    signerAddress: '',
    signature: {
      signature: '',
      r: '',
      s: '',
      v: '',
    }
  };

  async componentDidMount() {
    const date = moment().add(1, 'month').format("DD-MM-YYYY");
    const dateUnix = moment(date, "DD-MM-YYYY").unix();
    const parity = this.generateRandomString();

    // const voucherId = this.generateRandomString();
    this.getRunningNumber();
    console.log('date', date);
    console.log('dateUnix', dateUnix);
    // console.log('voucherId', voucherId);
    console.log('parity', parity);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        const signerAddress = (await web3.eth.getAccounts())[0];
        // console.log('signerAddress', signerAddress);
        this.setState({
          web3: web3,
          signerAddress: signerAddress,
        })
      } catch (error) {
        // User denied account access...
      }
    }
    this.setState({
      date: date,
      dateUnix: dateUnix,
      parity: parity,
    })
  }

  componentDidUpdate() {
    const ctx = document.getElementById("myqr").getContext('2d');
    const voucherCanvas = document.getElementById("voucherCanvas").getContext('2d');

    const logo = document.getElementById("logo");
    ctx.drawImage(logo,17.5,17.5, 10, 10);

    const voucher = document.getElementById("voucher");

    voucherCanvas.drawImage(voucher,0,0,2048,1310);
    voucherCanvas.drawImage(document.getElementById("myqr"),220,550,512,512);

    voucherCanvas.font = '52pt GlacialIndifference';
    voucherCanvas.fillText(this.state.voucherId + "-" + this.state.parity, 350, 530);
  }

  getRunningNumber = async () => {
    const GET_RUNNING_NUMBER_URL =
      "https://pktfredeemandwalletserver.herokuapp.com/voucher/getRandomVoucherId";
    const obj = await (await fetch(GET_RUNNING_NUMBER_URL)).json();
    // console.log('obj', obj)
    this.setState({
      voucherId: obj.voucherId
    });
    console.log("voucherId", obj.voucherId);
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      // console.log(name, value);
      const dateUnix = moment(value, "DD-MM-YYYY").unix();
      // console.log('time', time);
      this.setState({
        [name]: value,
        dateUnix: dateUnix,
      });
    }
  };

  generateRandomString = () => {
    let random = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
      random += possible.charAt(Math.floor(Math.random() * possible.length));
    return random;
  }

  signMessage = async () => {
    const web3 = this.state.web3;
    const { voucherId, parity, amount, dateUnix } = this.state;

    const intVoucherId = web3.utils.toDecimal('0x' + this.String2Hex(voucherId));
    const intParity = web3.utils.toDecimal('0x' + this.String2Hex(parity));

    console.log('signerAddress', this.state.signerAddress);

    console.log(intVoucherId);
    console.log(intParity);
    console.log(amount);
    console.log(dateUnix);

    const msg = '0x' + this.padZeros(this.String2Hex(voucherId), 64) 
    + this.padZeros(this.String2Hex(parity), 64) 
    + this.padZeros(amount.toString(16), 256) 
    + this.padZeros(dateUnix.toString(16), 256);

    console.log(msg);

    web3.eth.personal.sign(msg, this.state.signerAddress).then(signature => {
      const r = signature.slice(0, 66);
      const s = '0x' + signature.slice(66, 130);
      const v = web3.utils.toDecimal('0x' + signature.slice(130, 132));

      this.setState({
        signature: {
          signature: signature,
          r: r,
          s: s,
          v: v,
        }
      })

      console.log('v: ' + v)
      console.log('r: ' + r)
      console.log('s: ' + s)
    })
  }

  String2Hex = (tmp) => {
    let str = '';
    for (let i = 0; i < tmp.length; i++) {
      str += tmp[i].charCodeAt(0).toString(16);
    }
    return str;
  }

  padZeros = (bytes, numBit) => {
    const pad = (b, maxBytes) => (b.length < maxBytes) ? pad('0'+b, maxBytes):b
    return pad(bytes, numBit >> 2);
  };

  saveVoucher = async () => {
    const body = {
      "voucherId": this.state.voucherId,
      "intVoucherId": this.state.intVoucherId,
      "amount": this.state.amount,
      "signature": {
        "r": this.state.signature.r,
        "s": this.state.signature.s,
        "v": this.state.signature.v,
      },
      "expire": this.state.dateUnix,
      "msgLen": this.state.intMsgLength,
    }
    console.log('body', body);
    const SAVE_VOUCHER_URL =
      "https://pktfredeemandwalletserver.herokuapp.com/voucher/saveVoucher";
    const result = (await post(SAVE_VOUCHER_URL, body)).data;
    console.log('result', result);
  }

  render() {
    return (
      <div
        style={{
          marginTop: "50px"
        }}
      >
        <Header as="h2" color="teal" textAlign="center">
          <Image id="voucher" src="/voucher.png" style={{position: 'absolute', display: 'none'}} />
          <Image id="logo" src="/logo.png" width={60} height={60} /> Create Event Voucher
        </Header>
        <Divider />
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          // verticalAlign="middle"
          columns={2}
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form size="large" style={{ textAlign: 'left' }}>
              <Segment>
                <Form.Input
                  label="Voucher ID"
                  labelPosition="left"
                  fluid
                  icon="indent"
                  iconPosition="left"
                  placeholder="Voucher ID"
                  value={this.state.voucherId}
                  onChange={event => {
                    this.setState({ voucherId: event.target.value });
                  }}
                  readOnly
                />
                <Form.Input
                  label="Amount"
                  labelPosition="left"
                  fluid
                  type="number"
                  icon="dollar sign"
                  iconPosition="left"
                  placeholder="Amount"
                  value={this.state.amount}
                  onChange={event => {
                    this.setState({ amount: parseInt(event.target.value) });
                  }}
                />
                <DateInput
                  label="Expire date"
                  labelPosition="left"
                  closable
                  fluid
                  icon="calendar alternate outline"
                  iconPosition="left"
                  placeholder="Expire date"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChange}
                />

                <Form.Input
                  label="Parity"
                  labelPosition="left"
                  fluid
                  icon="random"
                  iconPosition="left"
                  placeholder="Parity"
                  value={this.state.parity}
                  readOnly
                />

                <Button color="teal" fluid size="large" onClick={this.signMessage}>
                  Secure Sign Message
                </Button>
              </Segment>
            </Form>
            <Form style={{ marginTop: 14, marginBottom: 14 }}>
              <Message style={{ padding: 14 }}>
                <TextArea style={{ minWidth: 392, minHeight: 75, resize: 'none' }} readOnly value={this.state.signature.signature} />
              </Message>
            </Form>
            <Message>
              <Button color='teal' fluid size='large' onClick={this.saveVoucher}>Confirm and Send</Button>
            </Message>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <QRCode id="myqr"
                value="https://pktfredemptionvoucher.herokuapp.com/pktfRedemptionVoucher?redeemCode=o5T9t-xxx123"
                style={{display: 'none'}}
                size={512}
                includeMargin={true}
              />
              <span style={{"font-family": 'GlacialIndifference'}}>&nbsp;</span>
              <canvas id="voucherCanvas" class="voucherCanvas"  width="2048" height="1310"></canvas>
              <Message>
                <Button color='teal' fluid size='large'>Print</Button>
              </Message>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
