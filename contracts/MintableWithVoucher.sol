pragma solidity ^0.4.23;

import "./PrivateToken.sol";

contract MintableWithVoucher is PrivateToken {
    mapping(uint64 => bool) usedVouchers;
    mapping(bytes32 => uint32) holderRedemptionCount;
    
    event VoucherUsed(
        uint64 voucherID,
        uint64 parityCode, 
        uint256 amount,  
        uint256 expired,  
        address indexed receiver, // use indexed for easy to filter event
        bytes32 socialHash
    );

    function isVoucherUsed(uint64 _voucherID) public view returns (bool) {
        return usedVouchers[_voucherID];
    }
    
    function markVoucherAsUsed(uint64 _voucherID) private {
        usedVouchers[_voucherID] = true;
    }

    function getHolderRedemptionCount(bytes32 socialHash) public view returns(uint32) {
        return holderRedemptionCount[socialHash];
    }

    function isVoucherExpired(uint256 expired) public view returns(bool) {
        return expired < now;
    }

    function expireTomorrow() public view returns (uint256) {
        return now + 1 days;
    }

    function expireNow() public view returns (uint256) {
        return now;
    }

    // Copyright (c) 2015-2016 Oraclize srl, Thomas Bertani
    function parseInt(string _value, uint _maxDecimals) internal view returns (uint) {
        bytes memory bresult = bytes(_value);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((bresult[i] >= 48) && (bresult[i] <= 57)) {
                if (decimals) {
                    if (_maxDecimals == 0) break;
                    else _maxDecimals--;
                }
                mint *= 10;
                mint += uint(bresult[i]) - 48;
            } else if (bresult[i] == 46) decimals = true;
        }
        return mint;
    }

    // Implement voucher system
    function redeemVoucher(
        uint8 _v, 
        bytes32 _r, 
        bytes32 _s,
        uint64 _voucherID,
        uint64 _parityCode,
        uint256 _amount,
        uint256 _expired,
        uint16 _msgLength,
        address _receiver,
        bytes32 _socialHash
    )  
    public 
    isNotFreezed
    {
        require(!isVoucherUsed(_voucherID), "Voucher has already been used.");
        require(!isVoucherExpired(_expired), "Voucher is expired.");
        
        bytes32 hash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                _msgLength,
                "|",
                _voucherID,
                "|",
                _parityCode,
                "|",
                _amount,
                "|",
                _expired
            )
        );
            
        require(ecrecover(hash, _v, _r, _s) == owner());

        // Mint
        // _mint(_receiver, parseInt(_amount, 0));
        _mint(_receiver, _amount);

        // Record new holder
        _recordNewTokenHolder(_receiver);

        markVoucherAsUsed(_voucherID);

        holderRedemptionCount[_socialHash]++;

        emit VoucherUsed(_voucherID, _parityCode, _amount,  _expired, _receiver, _socialHash);
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
        onlyOwner
        isNotFreezed {

        _burn(msg.sender, value);
        // _removeTokenHolder(msg.sender);
    }

    /**
        * @dev Burns a specific amount of tokens. Only owner can burn themself.
        * @param value The amount of token to be burned.
        */
    function burn(address account, uint256 value) 
        public
        onlyOwner
        isNotFreezed {

        _burn(account, value);
        // _removeTokenHolder(account);
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

        // if(balanceOf(account) == 0) {
        //     _removeTokenHolder(account);
        // }
    }
}
