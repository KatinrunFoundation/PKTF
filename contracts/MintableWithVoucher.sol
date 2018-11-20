pragma solidity ^0.4.23;  

import "./PrivateToken.sol";

contract MintableWithVoucher is PrivateToken {
    // Implement voucher system
    function redeemVoucher(
        // bytes32 hash, 
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s, 
        uint256 expire, 
        uint256 runnigNumber,
        uint256 amount, 
        uint256 expired,
        uint256 parity,
        address receiver, bytes32 socialHash) 
        public {

        require(!isFreezed);
        
        bytes32 hash = keccak256(abi.encodePacked(
            "running:", 
            runnigNumber,
            " Coupon for ",
            amount,
            " KTF expired ",
            expired
            ,
            " ",
            parity));
        
        require(ecrecover(hash, _v, _r, _s) == owner);

        _mint(msg.sender, value);

        // Record new holder
        _recordNewTokenHolder(msg.sender);
    }

    modifier mustSignByOwner(bytes32 hash, uint8 _v, bytes32 _r, bytes32 _s) {
        require(ecrecover(hash, _v, _r, _s) == owner);
        _;
    }


    /**
    * @dev Function to mint tokens
    * @param to The address that will receive the minted tokens.
    * @param value The amount of tokens to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function mint(address to,uint256 value) 
        public
        onlyOwner // todo: or onlyMinter
        returns (bool)
    {
        require(!isFreezed);
        _mint(to, value);

        // Record new holder
        _recordNewTokenHolder(msg.sender);

        return true;
    }

    /**
    * @dev Burns a specific amount of tokens.
    * @param value The amount of token to be burned.
    */
    function burn(uint256 value) public onlyOwner {

        require(!isFreezed);
        _burn(msg.sender, value);

        _removeTokenHolder(msg.sender);
    }
}