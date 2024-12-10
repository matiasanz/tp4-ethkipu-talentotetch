class Token{
    constructor(address, abi, name, unit, decimals, ){
        this.address = address
        this.abi = abi

        this.name = name
        this.shortName = name.split(' ')[1]
        this.unit = unit
        this.decimals = decimals
    }
}

const TokenA = new Token(
    '0x4be50cba473698b52e987f086335111bb27732c8',
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},{"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"ERC2612ExpiredSignature","type":"error"},{"inputs":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC2612InvalidSigner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"currentNonce","type":"uint256"}],"name":"InvalidAccountNonce","type":"error"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
    'Token A',
    'TKA',
    18    
)

const TokenB = new Token(
    '0x1e27469d20baf020cc0d86fd4fe5f6c766efaf10',
    [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},{"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"ERC2612ExpiredSignature","type":"error"},{"inputs":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC2612InvalidSigner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"currentNonce","type":"uint256"}],"name":"InvalidAccountNonce","type":"error"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
    'Token B',
    'TKB',
    18
)



let signer      = null
let tkaContract = null
let tkbContract = null
let simpleDExContract = null

// Login


    function reloadBalances(address){
        tkaContract.balanceOf(address)
            .then( balance => document.getElementById('balance-tka').innerText = balance/TokenA.decimals)
        tkbContract.balanceOf(address)
            .then(balance => document.getElementById('balance-tkb').innerText = balance/TokenB.decimals)
    }

    async function onClickBtnLogin() {
        if (!window.ethereum) {
            alert('MetaMask no está instalado');
            return
        }

        const {ethereum} = window
        // Solicitar conexión a MetaMask
        await ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner();
        const address = await signer.getAddress();

        //const scrollSepoliaProvider = new ethers.providers.JsonRpcProvider('https://scroll-sepolia-rpc.publicnode.com')
        tkaContract = new ethers.Contract(TokenA.address, TokenA.abi, signer)
        tkbContract = new ethers.Contract(TokenB.address, TokenB.abi, signer)

        reloadBalances(address)

        simpleDExContract = new ethers.Contract(
            '0x0718c693044DB2A66159bA3D97ADdd6bCCdB0d98',
            [{"inputs":[{"internalType":"contract ERC20","name":"_tokenA","type":"address"},{"internalType":"contract ERC20","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedAForB","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedBForA","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKB","type":"uint256"}],"name":"UpdatedLiquidity","type":"event"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountAIn","type":"uint256"}],"name":"swapAForB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountBIn","type":"uint256"}],"name":"swapBForA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            signer
        )

        
        simpleDExContract.getLiquidityPoolTokenA()
            .then(lp => document.getElementById('lp-tka').innerText = lp/TokenA.decimals)

        simpleDExContract.getLiquidityPoolTokenB()
            .then(lp => document.getElementById('lp-tkb').innerText = lp/TokenB.decimals)
        

        simpleDExContract.getPrice(TokenA.address)
            .then(price => document.getElementById('price-tka').innerText = price/TokenA.decimals)
            .catch(err => {
                document.getElementById('price-tka').innerText = '-'
                document.getElementById('price-tka-msg').innerText = err.reason
            })

        simpleDExContract.getPrice(TokenB.address)
            .then(price => document.getElementById('price-tkb').innerText = price/TokenB.decimals)
            .catch(err => {
                document.getElementById('price-tkb').innerText = '-'
                document.getElementById('price-tkb-msg').innerText = err.reason
            })

        document.getElementById("navbar--login").innerHTML = `
            <h4>${address}</h4>
            <button onclick="onClickBtnLogout()">Disconnect my wallet</button>
        `
        document.getElementById('content').hidden=false
        document.getElementById('content-alt').hidden=true
    }

    function onClickBtnLogout(){
        document.getElementById("navbar--login").innerHTML = `
            <button onclick="onClickBtnLogin()">Connect my wallet</button>
        `
        signer = null
        
        document.getElementById('content').hidden=true
        document.getElementById('content-alt').hidden=false
    }

    //Setup inicial
    onClickBtnLogout()


// Tokens swap
    function onSubmitFormSwapToken(form, event){
        event.preventDefault()
        const elements = form.elements

        const ammount = elements['swapAmmount'].value
        const tokenIn =  document.getElementById('form-swap--tokenIn--id').innerText
        const unit = elements['swapUnit'].value

        console.log(JSON.stringify({tokenIn, ammount, unit}))
        let promise = null; 
        let decimals = null
        if(tokenIn == 'A'){
            decimals = TokenA.decimals
            promise = simpleDExContract.swapAForB
        } else{
            decimals = TokenB.decimals
            promise = simpleDExContract.swapBForA
        }

        const adjustment = unit === 'Gweis'? 1: Math.pow(10, decimals)
        console.log(ammount*adjustment)
        promise(ammount*adjustment).then(
            async(tx) => {
                await tx.wait()
            }
        ).catch(err => document.getElementById('swap-error').innerText = err.reason)
    }

    function onClickBtnSwitchTokenToSwap(){
        const tokenIn = document.getElementById('form-swap--tokenIn--id')
        const tokenOut = document.getElementById('form-swap--tokenOut--id')
        if(tokenIn.innerText === TokenA.shortName){
            tokenIn.innerText = 'B'
            tokenOut.innerText = TokenA.shortName    
        } else{
            tokenIn.innerText = TokenA.shortName
            tokenOut.innerText = 'B'
        }
    }

    //Setup inicial
    onClickBtnSwitchTokenToSwap()

    function onSubmitFormManageLiquidity(form, event){
        event.preventDefault()
        const elements = form.elements
        let liquidityAmmount = elements['liquidityAmmount'].value
        const liquidityUnit = elements['liquidityUnit'].value
        const liquidityVerb = elements['liquidityVerb'].value
        const liquidityToken = elements['liquidityToken'].value

        const promise = liquidityVerb === 'Add'? 
            simpleDExContract.addLiquidity: simpleDExContract.removeLiquidity

        let decimals = null
        if(liquidityToken == 'A'){
            decimals = TokenA.decimals
        } else{
            decimals = TokenB.decimals
        }
        
        const adjustment = liquidityUnit === 'Gweis'? 1: Math.pow(10, decimals)
        liquidityAmmount*=adjustment
        
        const args = liquidityToken == TokenA.name?
            [liquidityAmmount, 0]: [0, liquidityAmmount]

        promise(...args)
            .then(tx=>{
                tx.wait()
                reloadBalances()
            })
            .catch(err => {
                document.getElementById('liquidity-error').innerText = err.reason
            })
    }
