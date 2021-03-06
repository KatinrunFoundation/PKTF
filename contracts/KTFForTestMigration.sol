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

    uint32 public holderCount;

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
        onlyOwner {

        uint32 numberOfPKTFHolders = pktf.numberOfTokenHolders();
        holderCount = numberOfPKTFHolders;
        
        for(uint256 i = 0; i < numberOfPKTFHolders; i++) {
          address user = pktf.holders(i);
          uint256 balance = pktf.balanceOf(user);

          mint(user, balance);
        }
    }

    /**
        * @dev Function to mint tokens
        * @param to The address that will receive the minted tokens.
        * @param value The amount of tokens to mint.
        * @return A boolean that indicates if the operation was successful.
        */
    function mint(address to,uint256 value) 
        public
        onlyOwner
        returns (bool)
    {
        _mint(to, value);

        return true;
    }
}
