pragma solidity ^0.4.23;  

import "./MintableWithVoucher.sol";

contract PrivateKatinrunFoudation is MintableWithVoucher {
    // uint256 public totalSupply;  
    string public name;  
    string public symbol;  
    uint32 public decimals; 

    PrivateToken public pktf;
    uint32 public holderCount;

    constructor(PrivateToken _pktf) public {  
        symbol = "PKTF";  
        name = "Private Katinrun Foundation";  
        decimals = 18;  
        _totalSupply = 0;  
        
        _balances[msg.sender] = _totalSupply;  

        if(_pktf != address(0)){
            pktf = _pktf;
            uint32 numberOfPKTFHolders = pktf.numberOfTokenHolders();
            holderCount = numberOfPKTFHolders;
            
            for(uint256 i = 0; i < numberOfPKTFHolders; i++) {
                address user = pktf.holders(i);
                uint256 balance = pktf.balanceOf(user);

                mint(user, balance);
            }
        }
        
        // emit Transfer(0x0, msg.sender, _totalSupply);  
    }
    
}
