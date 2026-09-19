// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Faucet is ERC1155, Ownable {
    mapping(address => uint256) public lastClaim;
    uint256 public constant CLAIM_COOLDOWN = 1 days;

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}

    function claimTokens(uint256 id, uint256 amount) external {
        require(block.timestamp >= lastClaim[msg.sender] + CLAIM_COOLDOWN, "Cooldown active");
        lastClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, id, amount, "");
    }
}
