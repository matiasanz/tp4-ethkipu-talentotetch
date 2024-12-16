// SPDX-License-Identifier: GPL-3.0
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.8.22 <0.9.0;

/**
 * @title Simple DEx
 * @dev Single owner's Descentralized Exchange for two tokens ERC20
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleDEX is Ownable{
  // Events
  /** Evento actualización de liquidez: Se emite al finalizar transacciones que produzcan una
    * variación en cualquiera de los pooles, es decir, tanto las de agregado y retiro de fondos,
    * por parte del propietario, como las de swap de divisas, a cargo de los usuarios.
    */
    event UpdatedLiquidity(uint256 liquidityPoolTKA, uint256 liquidityPoolTKB);

    // Eventos de swappeo de tokens: Se emiten luego de concretar operaciones de este tipo
    event SwappedAForB(address user, uint256 amountIn, uint256 amountOut);
    event SwappedBForA(address user, uint256 amountIn, uint256 amountOut);

  // Liquidity pools services
    ERC20 immutable tokenA;
    ERC20 immutable tokenB; 

    constructor(ERC20 _tokenA, ERC20 _tokenB) Ownable(msg.sender){
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

  // Modifiers  
    modifier anyNonZero(uint256 _firstParam, uint256 _secondParam){
        require(_firstParam>0 || _secondParam>0, "At least one parameter must be greater than 0");
        _;
    }

 /** Incrementa la liquidez de al menos uno de los pools por medio de un deposito de la cuenta del usuario.
   * Solo puede ser llamado por el dueño de este contrato, una vez otorgados los permisos de uso de su cuenta
   * del token deseado.
   */
    function addLiquidity(uint256 _amountA, uint256 _amountB)
        external onlyOwner anyNonZero(_amountA, _amountB){
        
        address _sender = msg.sender;
        address _self = address(this);

        require(allowedTransfer(tokenA, _sender, _amountA), "Not allowed to transfer token A");
        require(allowedTransfer(tokenB, _sender, _amountA), "Not allowed to transfer token B");

        transferIfPresentAmount(tokenA, _sender, _self, _amountA, "Failed to transfer token A from owner");
        transferIfPresentAmount(tokenB, _sender, _self, _amountB, "Failed to transfer token B from owner");

        emit UpdatedLiquidity(getLiquidityPoolTokenA(), getLiquidityPoolTokenB());
    }

 /** Permite retirar fondos de uno o ambos pools, disminuyendo la liquidez.
   * Esta función solo puede ser llamada por el propietario del contrato.
   * Los parametros ingresados corresponden a los montos a retirar, los cuales
   * no deben superar los saldos de sus respectivos pool.
   */
    function removeLiquidity(uint256 _amountA, uint256 _amountB)
        external onlyOwner anyNonZero(_amountA, _amountB) {
        uint256 _liquidityPoolTokenA = getLiquidityPoolTokenA(); 
        require(_liquidityPoolTokenA>=_amountA, "Invalid token A's amount");
        
        uint256 _liquidityPoolTokenB = getLiquidityPoolTokenB();
        require(_liquidityPoolTokenB>=_amountB, "Invalid token B's amount");

        address _self = address(this);
        address _sender = msg.sender;
        
        transferIfPresentAmount(tokenA, _self, _sender, _amountA, "Failed to transfer token A");
        transferIfPresentAmount(tokenB, _self, _sender, _amountB, "Failed to transfer token B");

        emit UpdatedLiquidity(_liquidityPoolTokenA - _amountA, _liquidityPoolTokenB - _amountB);
    }
 
 /** Use esta función para intercambiar el número de tokens 'tokenA' ingresado por parámetro
   * por una cantidad de 'tokenB' que mantenga el nivel de liquidez actual. Puede ser ejecutada
   * por cualquier usuario, debiendo este haber otorgado permisos a este contrato para manipular
   * ambos en su nombre. 
   */
    function swapAForB(uint256 _amountAIn)
        external {
        require(_amountAIn > 0, "Amount to swap must be greater than zero");
        
        address _sender = msg.sender;
        address _self = address(this);
        require(allowedTransfer(tokenA, _sender, _amountAIn), "Not allowed to transfer token A");
        bool _successIn = tokenA.transferFrom(_sender, _self, _amountAIn);
        require(_successIn, "Failed to transfer TKA from sender");

        uint256 _liquidityPoolTKA = getLiquidityPoolTokenA();
        uint256 _liquidityPoolTKB = getLiquidityPoolTokenB();

        uint256 _amountOut = calculateAmountOut(_amountAIn, _liquidityPoolTKA, _liquidityPoolTKB);

        transferIfPresentAmount(tokenB, _self, _sender, _amountOut, "Failed to transfer TKB from contract");

        emit SwappedAForB(_sender, _amountAIn, _amountOut);
        emit UpdatedLiquidity(_liquidityPoolTKA + _amountAIn, _liquidityPoolTKB - _amountOut);
    }

 /** Use esta función para intercambiar el número de tokens 'tokenB' ingresado por parámetro
   * por una cantidad de 'tokenA' que mantenga el nivel de liquidez actual. Puede ser ejecutada
   * por cualquier usuario, debiendo este haber otorgado permisos a este contrato para manipular
   * ambos en su nombre. 
   */
    function swapBForA(uint256 _amountBIn)
        external {
        require(_amountBIn > 0, "Amount to swap must be greater than zero");
        
        address _sender = msg.sender;
        address _self = address(this);
        require(allowedTransfer(tokenB, _sender, _amountBIn), "Not allowed to transfer token B");
        bool _successIn = tokenB.transferFrom(_sender, _self, _amountBIn);
        require(_successIn, "Failed to transfer token B from sender");

        uint256 _liquidityPoolTKA = getLiquidityPoolTokenA();
        uint256 _liquidityPoolTKB = getLiquidityPoolTokenB();

        uint256 _amountOut = calculateAmountOut(_amountBIn, _liquidityPoolTKB, _liquidityPoolTKA);
        
        transferIfPresentAmount(tokenA, _self, _sender, _amountOut, "Failed to transfer token A from contract");

        emit SwappedBForA(_sender, _amountBIn, _amountOut);
        emit UpdatedLiquidity(_liquidityPoolTKA - _amountOut, _liquidityPoolTKB + _amountBIn);
    }

 /** Auxiliar. Permite calcular la cantidad de dinero a pagar a cambio de un cierto monto de
   * uno de los token con tal de mantener la liquidez actual, a partir de los saldos actuales 
   * de ambos pools de liquidez.  
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

 /// Auxiliar. Retorna el saldo del pool de liquidez del token A.  
    function getLiquidityPoolTokenA() public view returns(uint256){
        return tokenA.balanceOf(address(this));
    }   

 /// Auxiliar. Retorna el saldo del pool de liquidez del token B.  
    function getLiquidityPoolTokenB() public view returns(uint256){
        return tokenB.balanceOf(address(this));
    }   

 /** Retorna la cotización de una unidad del token cuya dirección es ingresada por parámetro, en
   * la moneda por el otro. Para esto, se calcula la relación entre los saldos de ambos pooles de liquidez.
   * Puede ser llamada por cualquier usuario y en caso de ingresar la dirección de un token que no
   * se corresponda con los que estuvieran asociados a este contrato, revierte la operación.
   */
    function getPrice(address _token) external view returns(uint256) {
        uint256 _liquidityPoolTokenA = getLiquidityPoolTokenA();
        uint256 _liquidityPoolTokenB = getLiquidityPoolTokenB();
        if(_token == address(tokenA)){
            require(_liquidityPoolTokenA>0, "Can't calculate price while pool A is empty");
            return 10**tokenB.decimals()*_liquidityPoolTokenB/_liquidityPoolTokenA;
        }

        if(_token == address(tokenB)){
            require(_liquidityPoolTokenB>0, "Can't calculate price while pool B is empty");
            return 10**tokenA.decimals()*_liquidityPoolTokenA/_liquidityPoolTokenB;
        }

        revert("Unrecognized token");
    }

 /** Auxiliar. Realiza transferencias del token correspondiente al contrato de la dirección
   * del primer parámetro, desde la cuenta del segundo hacia la del tercero, en el monto indicado
   * en el cuarto, siempre y cuando este sea distinto de 0 y revierte la operación en caso de
   * fallar la transferencia, con el mensaje especificado en el quinto.
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

   /** Función Auxiliar para comprobar que el contrato tiene permisos de manipular
     * los suficientes fondos del usuario del token correspondiente, como para concretar
     * la transferencia
     */
    function allowedTransfer(ERC20 _token, address _from, uint256 _amount) private view returns(bool){
        return _token.allowance(_from, address(this)) >= _amount;
    }
}