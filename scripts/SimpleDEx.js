const SIMPLE_DEx_ADDRESS = '0x0718c693044DB2A66159bA3D97ADdd6bCCdB0d98'

class SimpleDExContract{
    initialize(signer){
        this.contract = new ethers.Contract(
            SIMPLE_DEx_ADDRESS,
            [{"inputs":[{"internalType":"contract ERC20","name":"_tokenA","type":"address"},{"internalType":"contract ERC20","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedAForB","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedBForA","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKB","type":"uint256"}],"name":"UpdatedLiquidity","type":"event"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountAIn","type":"uint256"}],"name":"swapAForB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountBIn","type":"uint256"}],"name":"swapBForA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            signer
        )
    }

    validateInitialized(){
        if(!this){
            alert('Por alguna razon, no le gusta el <<this>>')
        }
        if(!this.contract){
            alert('SimpleDEx wasnt initialized')
            throw new Error('SimpleDEx is not initialized')
        }
    }

    async swapAForB(ammount){
        this.validateInitialized()
        return this.contract.swapAForB(ammount)
            .then(tx => tx.wait())
    }

    async swapBForA(ammount){
        this.validateInitialized()
        return this.contract.swapBForA(ammount)
            .then(tx => tx.wait())
    }

    async getLiquidityPoolTokenA(tokenRefference){
        this.validateInitialized()
        return this.contract.getLiquidityPoolTokenA()
            .then(lp => tokenRefference.convertWeisToTK(lp))
    }

    async getLiquidityPoolTokenB(tokenRefference){
        this.validateInitialized()
        return this.contract.getLiquidityPoolTokenB()
            .then(lp => tokenRefference.convertWeisToTK(lp))
    }

    async getPrice(token) {
        this.validateInitialized()
        return this.contract.getPrice(token.address)
            .then(price => token.convertWeisToTK(price))
    }

    async addLiquidity(ammountTKA, ammountTKB){
        this.validateInitialized()
        return this.contract.addLiquidity(ammountTKA, ammountTKB)
            .then(tx=> tx.wait())
    }

    async removeLiquidity(ammountTKA, ammountTKB){
        this.validateInitialized()
        return this.contract.removeLiquidity(ammountTKA, ammountTKB)
            .then(tx=> tx.wait())
    }
}
    
//Global Value
const SimpleDEx = new SimpleDExContract()