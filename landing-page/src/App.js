import React, { Component } from "react";
// import styled from "styled-components";
import { Flex, Button, Box, Text, Image } from "rebass";
import { Highlight } from "../src/styleguides";

import ImgPart1 from "../src/assets/part1.png";
import ImgPart2 from "../src/assets/part2.png";
import ImgPart3 from "../src/assets/part3.jpg";
import ImgLogo from "../src/assets/logo.png";
import ArrowIcon from "../src/assets/arrow-down.png";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  openCoinBaseLink() {
    window.open("http://f68z.app.link/8FDncD2aKT", "_blank");
  }

  render() {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="center">
        <Image width={[1 / 4]} src={ImgLogo} my={2} />
        {/* <Text fontSize={30} py={2} px={3} fontWeight='bold' textAlign="center">
        Private Katinrun Foundation<br />
        (PKTF)
        </Text> */}
        <br />
        <br />
        <br />
        <Text py={4} fontSize={30} fontWeight="bold" color={"black"}>
          Instruction
        </Text>
        <Text fontSize={24} py={2} px={3} textAlign="center">
          1. Download and install <Highlight>Coinbase Wallet</Highlight> from
          Google's Play Store or Apple's App Store.
        </Text>
        <br />
        <Image width={[1 / 2]} src={ImgPart1} my={2} />
        <br />
        <br />
        <br />
        <Image width={[1 / 30]} src={ArrowIcon} my={2} />
        <br />
        <br />
        <br />
        <Text fontSize={24} pt={4} px={3} textAlign="center">
          2. Open <Highlight>Coinbase Wallet</Highlight> application 
          and navigate to <Highlight>DApps</Highlight> tab.
        </Text>
        <Image width={[1 / 2.5]} src={ImgPart2} my={2} />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Image width={[1 / 30]} src={ArrowIcon} my={2} />
        <br />
        <br />
        <br />
        <Text fontSize={24} pt={4} px={3} textAlign="center">
          3. Type in the url: <Highlight>http://bit.ly/2TdfrFF</Highlight>
          &nbsp;into <Highlight>Coinbase Wallet</Highlight> application 
          to access to <Highlight>a redemption portal</Highlight>.
        </Text>
        <br />
        <br />
        <Image width={[1 / 2.5]} src={ImgPart3} mt={3} />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Image width={[1 / 30]} src={ArrowIcon} my={2} />
        <br />
        <br />
        <br />
        <Box pt={4} mb="150px">
          <Button bg="#336600" onClick={this.openCoinBaseLink} width={300}>
            Download Coinbase Wallet
          </Button>
        </Box>
      </Flex>
    );
  }
}

export default App;
