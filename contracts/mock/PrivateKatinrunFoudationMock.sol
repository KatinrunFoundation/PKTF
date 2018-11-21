pragma solidity ^0.4.23;  

import "../PrivateKatinrunFoudation.sol";

contract PrivateKatinrunFoudationMock is PrivateKatinrunFoudation {
    // uint256 public totalSupply;  
    string public name;  
    string public symbol;  
    uint32 public decimals; 

    constructor(address initialAccount, uint256 initialBalance) public {
        _mint(initialAccount, initialBalance);
    }
}
