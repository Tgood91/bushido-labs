// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BushidoBased_Zora_v2 is Ownable {
    string public name = "Bushido Virtuals Base Zora";
    string public symbol = "BUSHIDO";
    
    event ExecutionLogged(string indexed strategy, uint256 amount, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function logStrategyExecution(string calldata strategy, uint256 amount) external onlyOwner {
        emit ExecutionLogged(strategy, amount, block.timestamp);
    }
}
