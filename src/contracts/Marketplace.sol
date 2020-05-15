pragma solidity ^0.5.0;

contract Marketplace {
    string public name;

    struct Product {
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }

    constructor() public {
        name = "Exploration Marketplace";
    }
}