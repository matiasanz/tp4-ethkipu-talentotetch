// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.8.22 <0.9.0;
/**
  * @title Simple DEx
  * @dev Single owner's Decentralized Exchange for two tokens ERC20
  * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
  */
  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract SimpleDEX is Ownable{
    // Events
    /**
      * @notice Event emitted after transactions that cause a variation in any of the liquidity pools,
      * including adding and withdrawing funds by the owner, and currency swaps by users.
      */
      event UpdatedLiquidity(uint256 liquidityPoolTKA, uint256 liquidityPoolTKB);
      
    /**
      * @notice Event emitted after completing token swap operations
      * @param user The address of the user involved in the token swap.
      * @param amountIn The amount of input tokens swapped.
      * @param amountOut The amount of output tokens received.
      */
      event SwappedAForB(address user, uint256 amountIn, uint256 amountOut);
      event SwappedBForA(address user, uint256 amountIn, uint256 amountOut);
      
    // Liquidity pools services
    ERC20 immutable private tokenA;
    ERC20 immutable private tokenB;

    constructor(ERC20 _tokenA, ERC20 _tokenB) Ownable(msg.sender){
        tokenA = _tokenA;
        tokenB = _tokenB;
    }    
    
    // Modifiers
    modifier anyNonZero(uint256 _firstParam, uint256 _secondParam){
        require(_firstParam>0 || _secondParam>0, "Both params are 0");
        _;
    }
    
    /**
      * @notice Increases the liquidity of at least one pool through a deposit from the user's account.
      * @dev Can only be called by the owner of this contract, once the permissions for using the desired token's account have been granted.
      * @param _amountA The amount of tokenA to deposit. * @param _amountB The amount of tokenB to deposit.
      */
    function addLiquidity(uint256 _amountA, uint256 _amountB)
        external onlyOwner anyNonZero(_amountA, _amountB){
        
        address _sender = msg.sender;
        address _self = address(this);

        require(allowedTransfer(tokenA, _sender, _amountA), "Not allowed to transfer TKA");
        require(allowedTransfer(tokenB, _sender, _amountA), "Not allowed to transfer TKB");

        transferIfPresentAmount(tokenA, _sender, _self, _amountA, "Failed to transfer TKA");
        transferIfPresentAmount(tokenB, _sender, _self, _amountB, "Failed to transfer TKB");

        emit UpdatedLiquidity(getLiquidityPoolTokenA(), getLiquidityPoolTokenB());
    }
    
    /**
      * @notice Allows the owner to withdraw funds from one or both pools, decreasing liquidity.
      * @dev Can only be called by the owner of this contract. 
      * @param _amountA The amount of tokenA to withdraw. 
      * @param _amountB The amount of tokenB to withdraw. 
      */
      function removeLiquidity(uint256 _amountA, uint256 _amountB)
        external onlyOwner anyNonZero(_amountA, _amountB) {
        uint256 _liquidityPoolTokenA = getLiquidityPoolTokenA(); 
        require(_liquidityPoolTokenA>=_amountA, "Not enough TKA");
        
        uint256 _liquidityPoolTokenB = getLiquidityPoolTokenB();
        require(_liquidityPoolTokenB>=_amountB, "Not enough TKB");

        address _self = address(this);
        address _sender = msg.sender;
        
        transferIfPresentAmount(tokenA, _self, _sender, _amountA, "Failed to transfer TKA");
        transferIfPresentAmount(tokenB, _self, _sender, _amountB, "Failed to transfer TKB");

        emit UpdatedLiquidity(_liquidityPoolTokenA - _amountA, _liquidityPoolTokenB - _amountB);
    } 

    /**
      * @notice Use this function to swap the input amount of tokenA for an equivalent amount of tokenB,
      * maintaining the current liquidity level. 
      * @dev Can be executed by any user who has granted permissions to this contract to manipulate both tokens on their behalf. 
      * @param _amountAIn The amount of tokenA to swap. 
      */
    function swapAForB(uint256 _amountAIn)
        external {
        require(_amountAIn > 0, "Amount to swap must be greater than zero");
        
        address _sender = msg.sender;
        address _self = address(this);
        require(allowedTransfer(tokenA, _sender, _amountAIn), "Not allowed to transfer TKA");
        bool _successIn = tokenA.transferFrom(_sender, _self, _amountAIn);
        require(_successIn, "Failed to transfer TKA");

        uint256 _liquidityPoolTKA = getLiquidityPoolTokenA();
        uint256 _liquidityPoolTKB = getLiquidityPoolTokenB();

        uint256 _amountOut = calculateAmountOut(_amountAIn, _liquidityPoolTKA, _liquidityPoolTKB);

        transferIfPresentAmount(tokenB, _self, _sender, _amountOut, "Failed to transfer TKB");

        emit SwappedAForB(_sender, _amountAIn, _amountOut);
        emit UpdatedLiquidity(_liquidityPoolTKA + _amountAIn, _liquidityPoolTKB - _amountOut);
    }

    /**
      * @notice Use this function to swap the input amount of tokenB for an equivalent amount of tokenA, 
      * maintaining the current liquidity level. 
      * @dev Can be executed by any user who has granted permissions to this contract to manipulate both tokens on their behalf. 
      * @param _amountBIn The amount of tokenB to swap. 
      */ 
      function swapBForA(uint256 _amountBIn)
        external {
        require(_amountBIn > 0, "Amount lower than zero");
        
        address _sender = msg.sender;
        address _self = address(this);
        require(allowedTransfer(tokenB, _sender, _amountBIn), "Not allowed to transfer token B");
        bool _successIn = tokenB.transferFrom(_sender, _self, _amountBIn);
        require(_successIn, "Failed to transfer TKB");

        uint256 _liquidityPoolTKA = getLiquidityPoolTokenA();
        uint256 _liquidityPoolTKB = getLiquidityPoolTokenB();

        uint256 _amountOut = calculateAmountOut(_amountBIn, _liquidityPoolTKB, _liquidityPoolTKA);
        
        transferIfPresentAmount(tokenA, _self, _sender, _amountOut, "Failed to transfer token A from contract");

        emit SwappedBForA(_sender, _amountBIn, _amountOut);
        emit UpdatedLiquidity(_liquidityPoolTKA - _amountOut, _liquidityPoolTKB + _amountBIn);
    }

    /**
      * @notice Auxiliary function. Calculates the output amount of one token in exchange for an input amount of another token, 
      * maintaining the current liquidity level, based on the current balances of both liquidity pools. 
      * @param _amountIn The amount of input tokens. 
      * @param _currentLiquidityIn The current balance of the input token's liquidity pool. 
      * @param _currentLiquidityOut The current balance of the output token's liquidity pool. 
      * @return The amount of output tokens. 
      */ 
      function calculateAmountOut(uint256 _amountIn, uint256 _currentLiquidityIn, uint256 _currentLiquidityOut)
        private pure returns(uint256) {
        /* ( Y - dY )( X + dX ) = X Y
         *   Y - dY             = X Y / ( X + dX )
         *       dY             = Y - X Y / ( X + dX )
         *       dY             = ( Y X + Y dX - XY ) / ( X + dX )
         *       dY             = Y dX / ( X + dX )
         */
        return _currentLiquidityOut*_amountIn/( _currentLiquidityIn + _amountIn );        
      }  

    /**
      * @notice Auxiliary function. Returns the balance of the tokenA liquidity pool.
      * @return The balance of the tokenA liquidity pool.
      */
      function getLiquidityPoolTokenA() public view returns(uint256){
        return tokenA.balanceOf(address(this));
      }   
      
    /**
      * @notice Auxiliary function. Returns the balance of the tokenB liquidity pool. 
      * @return The balance of the tokenB liquidity pool. 
      */
      function getLiquidityPoolTokenB() public view returns(uint256){
        return tokenB.balanceOf(address(this));
      }   
      
    /**
      * @notice Returns the price of one unit of the specified token in terms of the other token. 
      * @dev Calculates the ratio between the balances of the two liquidity pools. 
      * Can be called by any user. Reverts if the specified token is not associated with this contract. 
      * @param _token The address of the token. 
      * @return The price of one unit of the specified token in terms of the other token.
      */
      function getPrice(address _token) external view returns(uint256) {
          uint256 _liquidityPoolTokenA = getLiquidityPoolTokenA();
          uint256 _liquidityPoolTokenB = getLiquidityPoolTokenB();
          if(_token == address(tokenA)){
              require(_liquidityPoolTokenA>0, "Empty pool A");
              return 10**tokenB.decimals()*_liquidityPoolTokenB/_liquidityPoolTokenA;
          }

          if(_token == address(tokenB)){
              require(_liquidityPoolTokenB>0, "Empty pool B");
              return 10**tokenA.decimals()*_liquidityPoolTokenA/_liquidityPoolTokenB;
          }

          revert("Unrecognized token");
      }


  /**
   * @notice Auxiliary function to transfer tokens if the amount is greater than zero.
   * @dev Performs the transfer and reverts the transaction if it fails.
   * @param _token The ERC20 token to transfer.
   * @param _from The address from which the tokens will be transferred.
   * @param _to The address to which the tokens will be transferred.
   * @param _amount The amount of tokens to transfer.
   * @param _errorMsg The error message to revert with if the transfer fails.
   */
    function transferIfPresentAmount(
        ERC20 _token,
        address _from,
        address _to,
        uint256 _amount,
        string memory _errorMsg
    ) private {
        if(_amount > 0){
            bool success = _token.transferFrom(_from, _to, _amount);
            require(success, _errorMsg);
        }
    }

  /**
   * @notice Auxiliary function to check if the contract has permission to transfer the specified amount of tokens.
   * @param _token The ERC20 token to check.
   * @param _from The address from which the tokens will be transferred.
   * @param _amount The amount of tokens to transfer.
   * @return True if the contract has permission to transfer the tokens, false otherwise.
   */
    function allowedTransfer(ERC20 _token, address _from, uint256 _amount) private view returns(bool){
        return _token.allowance(_from, address(this)) >= _amount;
    }
}
