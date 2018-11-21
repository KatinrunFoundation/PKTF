pragma solidity ^0.4.23;  

import "./PrivateToken.sol";

contract MintableWithVoucher is PrivateToken {
    mapping(uint256 => bool) usedVouchers;
    mapping(bytes32 => uint32) holderRedemptionCount;
    
    event VoucherUsed(
        uint256 expire, 
        uint256 runnigNumber, 
        uint256 amount,  
        uint256 expired, 
        uint256 parity, 
        address indexed receiver, // use indexed for easy to filter event
        bytes32 socialHash
    );

    modifier isVoucherUnUsed(uint256 runnigNumber) {
        require(!usedVouchers[runnigNumber]);
        _;
    }
    
    function markVoucherAsUsed(uint256 runnigNumber) private {
        usedVouchers[runnigNumber] = true;
    }

    function getHolderRedemptionCount(bytes32 socialHash) public view returns(uint32) {
        return holderRedemptionCount[socialHash];
    }

    modifier voucherIsNotExpired(uint256 expired) {
        require(expired >= now);
        _;
    }

    // Implement voucher system
    function redeemVoucher(
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s, 
        uint256 expire, 
        uint256 runnigNumber,
        uint256 amount, 
        uint256 expired,
        uint256 parity,
        address receiver,
        bytes32 socialHash
    )  
        public 
        isNotFreezed
        voucherIsNotExpired(expired)
        isVoucherUnUsed(runnigNumber) {
        
        bytes32 hash = keccak256(
            abi.encodePacked(
                "running:", 
                runnigNumber,
                " Coupon for ",
                amount,
                " KTF expired ",
                expired
                ,
                " ",
                parity
            )
        );
            
        require(ecrecover(hash, _v, _r, _s) == owner());

        // Mint
        _mint(receiver, amount);

        // Record new holder
        _recordNewTokenHolder(receiver);

        markVoucherAsUsed(runnigNumber);

        holderRedemptionCount[socialHash]++;

        emit VoucherUsed(expire, runnigNumber, amount,  expired, parity, receiver, socialHash);
    }

    // modifier mustSignByOwner(bytes32 hash, uint8 _v, bytes32 _r, bytes32 _s) {
    //     require(ecrecover(hash, _v, _r, _s) == owner);
    //     _;
    // }
    
    /**
        * @dev Function to mint tokens
        * @param to The address that will receive the minted tokens.
        * @param value The amount of tokens to mint.
        * @return A boolean that indicates if the operation was successful.
        */
    function mint(address to,uint256 value) 
        public
        onlyOwner // todo: or onlyMinter
        isNotFreezed
        returns (bool)
    {
        _mint(to, value);

        // Record new holder
        _recordNewTokenHolder(to);

        return true;
    }

    /**
        * @dev Burns a specific amount of tokens. Only owner can burn themself.
        * @param value The amount of token to be burned.
        */
    function burn(uint256 value) 
        public
        isNotFreezed {

        _burn(msg.sender, value);
        _removeTokenHolder(msg.sender);
    }

    /**
        * @dev Burns a specific amount of tokens. Only owner can burn themself.
        * @param value The amount of token to be burned.
        */
    function burn(address account, uint32 value) 
        public
        onlyOwner
        isNotFreezed {

        _burn(account, value);
        _removeTokenHolder(account);
    }

    /**
        * @dev Internal function that burns an amount of the token of a given
        * account.
        * @param account The account whose tokens will be burnt.
        * @param value The amount that will be burnt.
        */
    function burnFrom(address account, uint256 value) 
        public 
        isNotFreezed 
        {
        require(account != address(0));

        _burnFrom(account, value);

        if(balanceOf(account) == 0) {
            _removeTokenHolder(account);
        }
    }
}
