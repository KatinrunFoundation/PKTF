import React, { Component } from "react";
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
import example_qr_code from "./images/example_qr_code.jpg"

class App extends Component {
  state = {
    runningNumber: '',
    voucherId: '',
    amount: '2000',
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
    },
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
      // voucherId: voucherId,
    })
  }

  getRunningNumber = async () => {
    const GET_RUNNING_NUMBER_URL =
      // "https://pktfredeemandwalletserver.herokuapp.com/voucher/getVoucherId";
      "https://pktfredeemandwalletserver.herokuapp.com/voucher/getRunningNumber";
    const obj = await (await fetch(GET_RUNNING_NUMBER_URL)).json();
    // console.log('obj', obj)
    this.setState({
      voucherId: obj.runningNumber
    });
    console.log("voucherId", this.state.voucherId);
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
    console.log('signerAddress', this.state.signerAddress);
    const { runningNumber, amount, voucherId, dateUnix, parity } = this.state;
    const msg = this.concatStringVoucher(runningNumber, voucherId, amount, dateUnix, parity);
    const msgLength = msg.length
    console.log('msg', msg);
    console.log('msgLength', msgLength);
    web3.eth.personal.sign(msg, this.state.signerAddress).then(signature => {

      const r = signature.slice(0, 66);
      const s = '0x' + signature.slice(66, 130);
      let v = '0x' + signature.slice(130, 132);
      v = web3.utils.toDecimal(v);
      this.setState({
        signature: {
          signature: signature,
          r: r,
          s: s,
          v: v,
        },
        msgLength: msgLength,
      })

      // console.log('r: ' + r)
      // console.log('s: ' + s)
      // console.log('v: ' + v)
    })
  }

  concatStringVoucher = (runningNumber, voucherId, amount, expired, parity) => {
    const string = 'running:' + runningNumber + ' Voucher ' + voucherId + ' Amount ' + amount + ' Expired ' + expired + ' Parity ' + parity;
    return string;
  }

  saveVoucher = () => {
    const SAVE_VOUCHER_URL =
      "https://pktfredeemandwalletserver.herokuapp.com/voucher/saveVoucher";
      fetch(SAVE_VOUCHER_URL, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: {
          "voucher": this.state.voucherId,
          "runningNumber": this.state.runningNumber,
          "amount": this.state.amount,
          "signature": {
            "r": this.state.signature.r,
            "s": this.state.signature.s,
            "v": this.state.signature.v,
          },
          "expire": this.state.dateUnix,
          "msgLen": 58
        }
       });
  }

  render() {
    return (
      <div
        style={{
          marginTop: "50px"
        }}
      >
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logo.png" width={60} height={60} /> Create Event Voucher
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
                  icon="dollar sign"
                  iconPosition="left"
                  placeholder="Amount"
                  value={this.state.amount}
                  onChange={event => {
                    this.setState({ amount: event.target.value });
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
              <Button color='teal' fluid size='large'>Confirm and Send</Button>
            </Message>
          </Grid.Column>
          <Grid.Column>
            <Segment>
            <Image src={example_qr_code} size='medium' wrapped />
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
