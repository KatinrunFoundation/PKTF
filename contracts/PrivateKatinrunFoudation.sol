pragma solidity ^0.4.23;  

import "./MintableWithVoucher.sol";

contract PrivateKatinrunFoudation is MintableWithVoucher {
    constructor() public {  
        symbol = "PKTF";  
        name = "Private Katinrun Foundation";  
        decimals = 18;  
        totalSupply = 0;  
        
        owner = msg.sender;
        balances[msg.sender] = totalSupply;  

        emit Transfer(0x0, msg.sender, totalSupply);  
    }
}
