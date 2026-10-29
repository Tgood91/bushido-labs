// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BushidoBased_Zora_v2 is Ownable {
    string public name = "Bushido Virtuals Base Zora";
    string public symbol = "BUSHIDO";
    
    event ExecutionLogged(string indexed strategy, uint256 amount, uint256 timestamp);

    constructor() Ownable(msg.sender) {0xba397faae1d5fe10c0356f2e585bef34577ab111}

    function logStrategyExecution(string calldata strategy, uint256 amount) external onlyOwner {
        emit ExecutionLogged(strategy, amount, block.timestamp);
    }
}
