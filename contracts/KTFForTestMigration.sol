pragma solidity ^0.4.23;  

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./PartialERC20.sol";
import "./PrivateToken.sol";

/**
    * @title Standard ERC20 token
    *
    * @dev Implementation of the basic standard token.
    * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
    * Originally based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
*/
contract KTFForTestMigration is PartialERC20, Ownable {
    // uint256 public totalSupply;  
    string public name;  
    string public symbol;  
    uint32 public decimals; 

    PrivateToken public pktf;

    constructor(PrivateToken _pktf) public {  
        symbol = "KTF";  
        name = "Katinrun Foundation";  
        decimals = 18;  
        _totalSupply = 0;
        
        _balances[msg.sender] = _totalSupply;  

        pktf = _pktf;
    }

    function migrateFromPKTF()
        public
        onlyOwner view {

        uint32 numberOfPKTFHolders = pktf.numberOfTokenHolders();
        
    }
}
