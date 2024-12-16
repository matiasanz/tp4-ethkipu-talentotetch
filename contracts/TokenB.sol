// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.8.22 <0.9.0;

/**
 * @title Token B
 * @dev Token ERC 20
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TokenB is ERC20, ERC20Permit {
    constructor() ERC20("Token B", "TKB") ERC20Permit("Token B") {
        _mint(msg.sender, 1000 * 10 ** decimals()); //Saldo inicial por usuario
    }
}