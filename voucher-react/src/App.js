import React, { Component } from "react";
import * as moment from 'moment';
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
    runningNumber: "",
    amount: "2000",
    expireDate: "",
    parity: "",
    date: "",
    dateUnix: "",
    dateTime: "",
    datesRange: ""
  };
  componentDidMount() {
    const date = moment().add(1, 'month').format("DD-MM-YYYY");
    const dateUnix = moment(date, "DD-MM-YYYY").unix();
    const parity = this.generateParity();
    console.log('date', date);
    console.log('dateUnix', dateUnix);
    console.log('parity', parity);
    this.setState({
      date: date,
      dateUnix: dateUnix,
      parity: parity,
    })
    this.getRunningNumber();
  }

  getRunningNumber = async () => {
    const GET_RUNNING_NUMBER_URL =
      "https://pktfredeemandwalletserver.herokuapp.com/voucher/getRunningNumber";
    const obj = await (await fetch(GET_RUNNING_NUMBER_URL)).json();
    this.setState({
      runningNumber: obj.runningNumber
    });
    console.log("runningNumber", obj.runningNumber);
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

  generateParity = () => {
    let random = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
      random += possible.charAt(Math.floor(Math.random() * possible.length));
    return random;
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
                  label="Running No."
                  labelPosition="left"
                  fluid
                  icon="address book"
                  iconPosition="left"
                  placeholder="Running Number"
                  value={this.state.runningNumber}
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

                <Button color="teal" fluid size="large">
                  Secure Sign Message
                </Button>
              </Segment>
            </Form>
            <Form style={{ marginTop: 14, marginBottom: 14 }}>
              <Message style={{ padding: 14 }}>
                <TextArea style={{ minWidth: 392, minHeight: 75, resize: 'none' }} readOnly value="test" />
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
