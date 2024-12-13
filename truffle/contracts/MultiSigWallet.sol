// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Multisig {
    address[] public owners;
    mapping(uint => mapping(address => bool)) public isConfirme;
    mapping(address => bool) public isOwner;
    mapping(uint => Transaction) public getTx; // get tx struct by an id
    event checkTx(address to , uint value);
    uint public confirmNum;

    struct Transaction {
        uint id;
        address to;
        uint value;
        bool executed;
        uint confirmCount;
    }
    Transaction[] private transactions; // if its is public then get value by index

    modifier onlyOwners() {
        require(
            isOwner[msg.sender],
            "Only Owners Can Access Control Over Funds"
        );
        _;
    }
    modifier CheckConfirme(uint id) {
        // require(true => execute code,"false => code not executed");
        require(
            !isConfirme[id][msg.sender],
            "Transaction Already Confirmed On This Id"
        );
        _;
    }
    modifier txExist(uint id) {
        require(getTx[id].id == id, "Transaction Is Not Exist On This Id");
        _;
    }
    modifier CheckExecuted(uint id) {
        require(!getTx[id].executed, "Transaction Already Executed On This Id");
        _;
    }
    //0xdD870fA1b7C4700F2BD7f44238821C26f7392148
    //  ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x5B38Da6a701c568545dCfcB03FcB875f56beddC4","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
    function setOwners(address[] memory _owners, uint _confirmeNum) external {
        require(_owners.length > 0, "Please Enter Vailed Owner Addresses");
        require(
            _confirmeNum > 0 && _confirmeNum <= _owners.length,
            "Confirm Number Must Be Greater Than Zero & Less Than Equal Owners Length"
        );

        confirmNum = _confirmeNum;

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invailed adresses");
            require(!isOwner[owner], "Already have wallet,Set another accounts or use existing wallet");
            isOwner[owner] = true;
            owners.push(owner);
        }
    }
    function submit(
        address _to,
        uint _id
    ) public payable onlyOwners CheckConfirme(_id) CheckExecuted(_id) {
        require(getTx[_id].id != _id, "Transaction Already Submited");
        require(msg.value >= 1 ether, "Value Must be Greater than Equal 1 ETH");
        
        for (uint256 i = 0; i < owners.length; i++) {
            bool check = owners[i] != _to;
            require(check, "Transaction can't submit to owner");
        }

        Transaction memory trans = Transaction({
            id: _id,
            to: _to,
            value: msg.value,
            executed: false,
            confirmCount: 0
        });

        getTx[_id] = trans;
        transactions.push(trans);

       
    }

    function ConfirmTx(
        uint _id
    ) public onlyOwners txExist(_id) CheckConfirme(_id) CheckExecuted(_id) {
        isConfirme[_id][msg.sender] = true;

        // getTx[_id].confirmCount ++;  Shortcut method
        // Transaction memory trans = getTx[_id]; //Not shortcut explained crearly
        // trans.confirmCount ++;
        Transaction storage trans = getTx[_id]; //Must use strage instead of memory because here we update state variable //Not shortcut explained crearly
        trans.confirmCount++;
    }

    function Executed(uint id) public onlyOwners txExist(id) CheckExecuted(id) {
        Transaction storage txins = getTx[id];
        require(
            txins.confirmCount >= confirmNum,
            "Transaction Is Not Confirmed By Requred Confirme Numbers"
        );
        txins.executed = true;
        (bool sent,) = txins.to.call{value: txins.value}("");

        // delete owners;

        emit checkTx(txins.to, txins.value);
        txins.value = 0 ether;

        // (bool sent, ) = txins.to.call{value: txins.value}("");
        require(sent, "Transaction Failed");
    }
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
    function resetwallet() public {

        for (uint256 i = 0; i < owners.length; i++) {
            isOwner[owners[i]] = false;
        }
        delete owners;
        delete transactions;
    }
}
