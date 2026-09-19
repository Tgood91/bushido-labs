// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract VirtueAuditRegistry is AccessControl {
    bytes32 public constant RECORDER_ROLE = keccak256("RECORDER_ROLE");

    struct VirtueScore {
        uint256 gi;      // Righteousness
        uint256 yu;      // Courage
        uint256 jin;     // Benevolence
        uint256 meiyo;   // Honour
        uint256 jisei;   // Self-Control
    }

    mapping(address => VirtueScore) public userVirtues;

    event VirtueRecorded(address indexed trader, uint256 gi, uint256 yu, uint256 jin, uint256 meiyo, uint256 jisei);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function recordTradeScore(
        address trader,
        uint256 gi,
        uint256 yu,
        uint256 jin,
        uint256 meiyo,
        uint256 jisei
    ) external onlyRole(RECORDER_ROLE) {
        VirtueScore storage score = userVirtues[trader];
        score.gi += gi;
        score.yu += yu;
        score.jin += jin;
        score.meiyo += meiyo;
        score.jisei += jisei;

        emit VirtueRecorded(trader, gi, yu, jin, meiyo, jisei);
    }

    function getTotalTradeVirtue(address trader) external view returns (uint256) {
        VirtueScore memory s = userVirtues[trader];
        return s.gi + s.yu + s.jin + s.meiyo + s.jisei;
    }
}
