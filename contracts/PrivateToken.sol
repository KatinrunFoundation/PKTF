pragma solidity ^0.4.23;  

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./PartialERC20.sol";

/**  
* @title Private Token
* @dev This Private token used for early adoption for token holders, and have mechanism for migration to a production token.
* @dev Migration Flow:
*       Step1: call freeze()
*       Step2: Loop mint for all holders on a production token.
*/  
contract PrivateToken is PartialERC20, Ownable {
    
    uint256 public tokenHoldersCount = 0;
    bool public isFreezed = false;
    
    uint256 public totalSupply;  
    string public name;  
    string public symbol;  
    uint32 public decimals; 
    
    address[] public holders;
    mapping(address => uint256) indexOfHolders;

    event Freezed(address);

    function isTokenHolder(address addr) public view returns(bool) {
        return indexOfHolders[addr] > 0;        
    }

    modifier isNotFreezed() {
        require(!isFreezed);
        _;
    }

    function freeze() public onlyOwner {
        isFreezed = true;

        emit Freezed(msg.sender);
    }

    function _recordNewTokenHolder(address holder) internal {
        // Record new holder
        if (!isTokenHolder(holder)) {
            holders.push(holder);
            indexOfHolders[holder] = tokenHoldersCount;
            tokenHoldersCount++;
        }
    }

    function _removeTokenHolder(address holder) internal {
        if(balanceOf(holder) == 0) {
            // delete holder in holders
            uint index = indexOfHolders[holder];
            if(index < 0) return;

            if (holders.length > 1) {
                holders[index] = holders[holders.length - 1];
            }
            tokenHoldersCount--;
            holders.length--;
            indexOfHolders[holder] = 0;
        }
    }

    /**
        * @dev Transfer token for a specified address
        * @param to The address to transfer to.
        * @param value The amount to be transferred.
        */
    function transfer(address to, uint256 value) 
        public 
        isNotFreezed
        returns (bool) {

        _transfer(msg.sender, to, value);

        // Record new holder
        _recordNewTokenHolder(msg.sender);

        return true;
    }

    /**
        * @dev Transfer tokens from one address to another
        * @param from address The address which you want to send tokens from
        * @param to address The address which you want to transfer to
        * @param value uint256 the amount of tokens to be transferred
        */
    function transferFrom(address from, address to, uint256 value) 
        public 
        isNotFreezed
        returns (bool) {

        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
        _transfer(from, to, value);
        
        // Record new holder
        _recordNewTokenHolder(msg.sender);
        
        return true;
    }

    /**  
        * @dev Return number of token holders
        */  
    function tokenHoldersCount() public view returns (uint256) {
        return tokenHoldersCount;
    }
}