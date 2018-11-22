pragma solidity ^0.4.23;

import "./PrivateToken.sol";

contract MintableWithVoucher is PrivateToken {
    mapping(uint256 => bool) usedVouchers;
    mapping(bytes32 => uint32) holderRedemptionCount;
    
    event VoucherUsed(
        string runnigNumber, 
        string amount,  
        string expired, 
        string parity, 
        address indexed receiver, // use indexed for easy to filter event
        bytes32 socialHash
    );

    function isVoucherUsed(uint256 runnigNumber) public view returns (bool) {
        return usedVouchers[runnigNumber];
    }
    
    function markVoucherAsUsed(uint256 runnigNumber) private {
        usedVouchers[runnigNumber] = true;
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
        string _msgLength,
        string _runnigNumber,
        string _amount, 
        string _expired,
        string _parity,
        address _receiver,
        bytes32 _socialHash
    )  
        public 
        isNotFreezed
        {

        uint256 runnigNumber = parseInt(_runnigNumber, 0);
        uint256 expired = parseInt(_expired, 0);

        require(!isVoucherUsed(runnigNumber), "Voucher's already been used.");
        require(!isVoucherExpired(expired), "Voucher's expired.");
        
        bytes32 hash = keccak256(
            "\x19Ethereum Signed Message:\n",
            _msgLength,
            "running:",
            _runnigNumber,
            " Voucher for ",
            _amount,
            " Expired ",
            _expired,
            " Parity ",
            _parity
        );
            
        require(ecrecover(hash, _v, _r, _s) == owner());

        // // Mint
        _mint(_receiver, parseInt(_amount, 0));

        // // Record new holder
        _recordNewTokenHolder(_receiver);

        markVoucherAsUsed(runnigNumber);

        holderRedemptionCount[_socialHash]++;

        emit VoucherUsed(_runnigNumber, _amount,  _expired, _parity, _receiver, _socialHash);
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

        burn(msg.sender, value);
    }

    /**
        * @dev Internal function that burns an amount of the token of a given
        * account.
        * @param account The account whose tokens will be burnt.
        * @param value The amount that will be burnt.
        */
    function burn(address account, uint256 value) 
        public 
        onlyOwner
        isNotFreezed
        {
        require(account != address(0));

        _burn(account, value);

        _removeTokenHolder(msg.sender);
    }
}
