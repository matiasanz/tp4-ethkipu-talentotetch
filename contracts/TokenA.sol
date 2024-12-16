// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.8.22 <0.9.0;

/**
 * @title Token A
 * @dev Token ERC 20
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TokenA is ERC20, ERC20Permit {
    constructor() ERC20("Token A", "TKA") ERC20Permit("Token A") {}

    /**
      * @notice Function to mint tokens in [weis].
      * @dev Can only be called by the owner of the contract. 
      * @param _to The address to which the minted tokens will be sent. 
      * @param _amount The amount of tokens to be minted. 
      */
    function mint(address _to, uint256 _amount) external onlyOwner{
        _mint(_to, _amount);
    } 
}