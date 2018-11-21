pragma solidity ^0.4.23;  

import "./MintableWithVoucher.sol";

contract PrivateKatinrunFoudation is MintableWithVoucher {
    // uint256 public totalSupply;  
    string public name;  
    string public symbol;  
    uint32 public decimals; 

    constructor() public {  
        symbol = "PKTF";  
        name = "Private Katinrun Foundation";  
        decimals = 18;  
        _totalSupply = 0;  
        
        _balances[msg.sender] = _totalSupply;  

        // emit Transfer(0x0, msg.sender, _totalSupply);  
    }
    
}
