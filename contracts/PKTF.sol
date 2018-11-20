pragma solidity ^0.4.23;  
  
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";  
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";  
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";





// /**  
// * @title BearToken is a basic ERC20 Token  
// */ 
// contract PrivateToken is StandardToken, Ownable {
  
//     uint256 public totalSupply;  
//     string public name;  
//     string public symbol;  
//     uint32 public decimals;  
  
//  /**  
//  * @dev assign totalSupply to account creating this contract 
//  */  
    // constructor() public {  
    //     symbol = "CUB";  
    //     name = "CubToken";  
    //     decimals = 5;  
    //     totalSupply = 100000000000;  

    //     owner = msg.sender;  
    //     balances[msg.sender] = totalSupply;  

    //     emit Transfer(0x0, msg.sender, totalSupply);  
    // }
// }

// contract PrivateKatinrunFoundation is Ownable, Pausable {  
  
//     /**  
//     * @dev Details of each transfer * @param contract_ contract address of ER20 token to transfer * @param to_ receiving account * @param amount_ number of tokens to transfer to_ account * @param failed_ if transfer was successful or not */
//     struct Transfer {  
//         address contract_;  
//         address to_;  
//         uint amount_;  
//         bool failed_;  
//     }  
//     /**  
//     * @dev a mapping from transaction ID's to the sender address * that initiates them. Owners can create several transactions */  
//     mapping(address => uint[]) public transactionIndexesToSender;  
  
  
//     /**  
//     * @dev a list of all transfers successful or unsuccessful */  
//     Transfer[] public transactions;  

//     address public owner;  

//     /**  
//     * @dev list of all supported tokens for transfer * @param string token symbol * @param address contract address of token */  mapping(bytes32 => address) public tokens;  

//     ERC20 public ERC20Interface;  

//     /**  
//     * @dev Event to notify if transfer successful or failed * after account approval verified */  event TransferSuccessful(address indexed from_, address indexed to_, uint256 amount_);  

//     event TransferFailed(address indexed from_, address indexed to_, uint256 amount_);  
  
//     constructor() public {  
//         owner = msg.sender;  
//     }  
//     /**  
//     * @dev add address of token to list of supported tokens using * token symbol as identifier in mapping */  
//     function addNewToken(bytes32 symbol_, address address_) public onlyOwner returns (bool) {  
//         tokens[symbol_] = address_;  

//         return true;  
//     }  
//     /**  
//     * @dev remove address of token we no more support */  
//     function removeToken(bytes32 symbol_) public onlyOwner returns (bool) {  
//         require(tokens[symbol_] != 0x0);  

//         delete(tokens[symbol_]);  

//         return true;  
//     }  
//     /**  
//     * @dev method that handles transfer of ERC20 tokens to other address * it assumes the calling address has approved this contract * as spender * @param symbol_ identifier mapping to a token contract address * @param to_ beneficiary address * @param amount_ numbers of token to transfer */  
//     function transferTokens(bytes32 symbol_, address to_, uint256 amount_) public whenNotPaused{  
//         require(tokens[symbol_] != 0x0);  
//         require(amount_ > 0);  

//         address contract_ = tokens[symbol_];  
//         address from_ = msg.sender;  

//         ERC20Interface = ERC20(contract_);  

//         uint256 transactionId = transactions.push(  
//             Transfer({  
//                 contract_:  contract_,  
//                     to_: to_,  
//                     amount_: amount_,  
//                     failed_: true  
//             })  
//             );  
//         transactionIndexesToSender[from_].push(transactionId - 1);  

//         if(amount_ > ERC20Interface.allowance(from_, address(this))) {  
//             emit TransferFailed(from_, to_, amount_);  
//             revert();  
//         }  
//         ERC20Interface.transferFrom(from_, to_, amount_);  

//         transactions[transactionId - 1].failed_ = false;  

//         emit TransferSuccessful(from_, to_, amount_);  
//     }  
//     /**  
//     * @dev allow contract to receive funds */  function() public payable {}  

//     /**  
//     * @dev withdraw funds from this contract * @param beneficiary address to receive ether */  
//     function withdraw(address beneficiary) public payable onlyOwner whenNotPaused {  
//         beneficiary.transfer(address(this).balance);  
//     }
// }