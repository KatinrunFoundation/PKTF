import React, { Component } from "react";
// import styled from "styled-components";
import { Flex, Button, Box, Text, Image } from "rebass";
import { Highlight } from "../src/styleguides";

import ImgPart1 from "../src/assets/part1.png";
import ImgPart2 from "../src/assets/part2.png";
import ImgPart3 from "../src/assets/part3.jpg";
import ImgLogo from "../src/assets/logo.png";

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
        <Image width={[1 / 2.5]} src={ImgLogo} my={2} />
        <Text>Private Katinrun Foundation</Text>
        <Text>(PKTF)</Text>
        <Text py={4} fontSize={30} fontWeight="bold" color={"black"}>
          Instruction
        </Text>
        <Text fontSize={18} py={2} px={3} textAlign="center">
          1. Install <Highlight>CoinBase Wallet</Highlight> on
          PlayStore/AppStore.
        </Text>
        <Image width={[1 / 2]} src={ImgPart1} my={2} />
        <Text fontSize={18} pt={4} px={3} textAlign="center">
          2. Open <Highlight>DApps</Highlight> Tab on Application.
        </Text>
        <Image width={[1 / 2.5]} src={ImgPart2} my={2} />
        <Text fontSize={18} pt={4} px={3} textAlign="center">
          3. Insert <Highlight>URL</Highlight> which you will receive from
          staffs.
        </Text>
        <Image width={[1 / 2.5]} src={ImgPart3} mt={3} />
        <Box pt={4} mb="150px">
          <Button bg="#336600" onClick={this.openCoinBaseLink} width={160}>
            Let's redeem
          </Button>
        </Box>
      </Flex>
    );
  }
}

export default App;
