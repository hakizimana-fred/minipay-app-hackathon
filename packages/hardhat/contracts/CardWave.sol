// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;


/**
 * @title CardWave
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */


contract CardWave {
address public owner;

    struct Giftcard {
        address owner;
        uint value;
        bytes32 code; 
        string businessName;
    }

    mapping (address => uint) balances;
    mapping (bytes32 => Giftcard) giftcards;
    bytes32[] public allGiftcardCodes;

    event Redeemed(address indexed _by, bytes32 _hash);
    event Spent(address indexed _by, uint _amount);

    constructor() {
        owner = msg.sender;
    }

    function issue(bytes32 code, uint value, string memory _businessName) public {
        require(msg.sender == owner, "Only the owner can issue new giftcards");
        require(value > 0, "Giftcard must have a balance");
        // require(giftcards[code].value == 0, "Giftcard already issued");

        giftcards[code] = Giftcard({
            value: value,
            owner: address(0), 
            code: code,
            businessName: _businessName
        });
      allGiftcardCodes.push(code);
    }

    function redeem(bytes32 code) public {
        Giftcard storage giftcard = giftcards[code];

        require(giftcard.value > 0, "Invalid giftcard code");
        require(giftcard.owner == address(0), "Giftcard already redeemed");

        giftcard.owner = msg.sender;
        balances[msg.sender] += giftcard.value;

        emit Redeemed(msg.sender, code);
    }

    function spend(address by, uint amount) public {
        require(msg.sender == owner, "Only the owner can deduct from balance");

        uint balance = balances[by];

        require(balance >= amount, 'Insufficient funds');

        balances[by] -= amount;

        emit Spent(by, amount);
    }

    function getBalance() public view returns (uint _balance) {
        _balance = balances[msg.sender];
    }

    function getGiftcard(bytes32 code) public view returns (address, uint, bytes32) {
        Giftcard memory giftcard = giftcards[code];
        return (giftcard.owner, giftcard.value, giftcard.code);
    }

 function fetchAllGiftcards() public view returns (Giftcard[] memory, bytes32[] memory, uint[] memory, address[] memory) {
        uint length = allGiftcardCodes.length;
        Giftcard[] memory giftcardDetails = new Giftcard[](length);
        bytes32[] memory codes = new bytes32[](length);
        uint[] memory values = new uint[](length);
        address[] memory owners = new address[](length);
        string[] memory businessName = new string[](length);
        
        for (uint i = 0; i < length; i++) {
            Giftcard storage giftcard = giftcards[allGiftcardCodes[i]];
            giftcardDetails[i] = giftcard;
            codes[i] = giftcard.code;
            values[i] = giftcard.value;
            owners[i] = giftcard.owner;
            businessName[i] = giftcard.businessName;
        }
        return (giftcardDetails, codes, values, owners);
}

    receive() external payable {}
  
}