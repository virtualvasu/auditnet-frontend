export const sampleContracts = {
  contract: [
    {
      name: 'Vulnerable Bank',
      code: `pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Vulnerable to reentrancy attack
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount;
    }
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}`
    },
    {
      name: 'Timestamp Dependency',
      code: `pragma solidity ^0.8.0;

contract TimestampDependency {
    uint public lastAction;
    mapping(address => bool) public hasActed;
    
    function performAction() public {
        // Vulnerable: depends on block.timestamp
        require(block.timestamp > lastAction + 10, "Too soon");
        require(!hasActed[msg.sender], "Already acted");
        
        hasActed[msg.sender] = true;
        lastAction = block.timestamp;
        
        // Some action here...
        payable(msg.sender).transfer(1 ether);
    }
}`
    },
    {
      name: 'Unchecked Send',
      code: `pragma solidity ^0.8.0;

contract UncheckedSend {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        
        // Vulnerable: not checking return value
        payable(msg.sender).send(amount);
    }
}`
    },
    {
      name: 'Safe Contract',
      code: `pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafeContract is ReentrancyGuard, Ownable {
    mapping(address => uint) public balances;
    
    event Deposit(address indexed user, uint amount);
    event Withdrawal(address indexed user, uint amount);
    
    function deposit() public payable {
        require(msg.value > 0, "Must deposit positive amount");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint amount) public nonReentrant {
        require(amount > 0, "Must withdraw positive amount");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
}`
    }
  ],
  function: [
    {
      name: 'Reentrancy Vulnerable',
      code: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // Vulnerable: external call before state change
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    
    balances[msg.sender] -= amount;
}`
    },
    {
      name: 'Timestamp Dependency',
      code: `function claimReward() public {
    require(block.timestamp > lastClaim[msg.sender] + 1 days, "Too soon");
    require(!hasClaimed[msg.sender], "Already claimed");
    
    hasClaimed[msg.sender] = true;
    lastClaim[msg.sender] = block.timestamp;
    
    payable(msg.sender).transfer(rewardAmount);
}`
    },
    {
      name: 'Unchecked Send',
      code: `function sendPayment(address recipient, uint amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    balances[msg.sender] -= amount;
    
    // Vulnerable: not checking return value
    payable(recipient).send(amount);
}`
    },
    {
      name: 'tx.origin Usage',
      code: `function authorize(address target) public {
    // Vulnerable: using tx.origin instead of msg.sender
    require(tx.origin == owner, "Not authorized");
    
    authorized[target] = true;
}`
    },
    {
      name: 'Integer Overflow',
      code: `function add(uint a, uint b) public pure returns (uint) {
    // Vulnerable in older Solidity versions without SafeMath
    return a + b; // Can overflow
}`
    },
    {
      name: 'Safe Function',
      code: `function safeWithdraw(uint amount) public nonReentrant {
    require(amount > 0, "Must withdraw positive amount");
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    balances[msg.sender] -= amount;
    
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed");
}`
    }
  ]
};