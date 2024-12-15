const SIMPLE_DEx_ADDRESS = '0x0718c693044DB2A66159bA3D97ADdd6bCCdB0d98'

let signerAddress = null
let simpleDExContract = null

// Login

function getTimeString(){
    return new Date().toTimeString().slice(0, 17)
}

async function onClickBtnShowAccountStatus(){
    document.getElementById('account-status-btn').innerText = `Refresh`
    document.getElementById('account-status-last-update').innerText = `(last update: ${getTimeString()})`
    document.getElementById('account-status-content').innerHTML = `
        <thead>
            <th></th>
            <th>Balance</th>
            <th>Allowance</th>
        </thead>
        <tbody>
            <tr>
                <td>Token A</td>
                <td><span id="balance-tka">loading...</span> TKA</td>
                <td><span id="allowance-tka">loading...</span> TKA</td>
            </tr>
            <tr>
                <td>Token B</td>
                <td><span id="balance-tkb">loading...</span> TKB</td>
                <td><span id="allowance-tkb">loading...</span> TKB</td>
            </tr>
        </tbody>
    `

    const address = signerAddress;

    TokenA.getBalanceOf(address)
        .then(balance => document.getElementById('balance-tka').innerText = balance)

    TokenB.getBalanceOf(address)
        .then(balance => document.getElementById('balance-tkb').innerText = balance)

    TokenA.getAllowanceOf(address, SIMPLE_DEx_ADDRESS)
        .then( allowance => document.getElementById('allowance-tka').innerText = allowance)

    TokenB.getAllowanceOf(address, SIMPLE_DEx_ADDRESS)
        .then( allowance => document.getElementById('allowance-tkb').innerText = allowance )
}

async function onClickBtnShowLP() {
    document.getElementById('lp-btn').innerText = 'Refresh'
    document.getElementById('lp-last-update').innerText = `(last update: ${getTimeString()})`
    document.getElementById('lp-content').innerHTML = `
        <thead>
            <tr>
                <th></th>
                <th>Liquidity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tr>
            <td>Token A</td>
            <td><span id="lp-tka">loading...</span> TKA</td>
            <td><span id="price-tka">loading...</span></td>
        </tr>
        <tr>
            <td id="price-tka-msg" colspan="3"></td>
        </tr>
        <tr>
            <td>Token B</td>
            <td><span id="lp-tkb">loading...</span> TKB</td>
            <td><span id="price-tkb">loading...</span></td>
        </tr>
        <tr>
            <td id="price-tkb-msg" colspan="3"></td>
        </tr>
    `

    simpleDExContract.getLiquidityPoolTokenA()
        .then(lp => document.getElementById('lp-tka').innerText = weisToTK(lp, TokenA))

    simpleDExContract.getLiquidityPoolTokenB()
        .then(lp => document.getElementById('lp-tkb').innerText = weisToTK(lp, TokenB))


    simpleDExContract.getPrice(TokenA.address)
        .then(price => document.getElementById('price-tka').innerText = weisToTK(price, TokenA) )
        .catch(err => {
            document.getElementById('price-tka').innerText = '-'
            document.getElementById('price-tka-msg').innerText = err.reason
        })

    simpleDExContract.getPrice(TokenB.address)
        .then(price => document.getElementById('price-tkb').innerText = weisToTK(price, TokenB))
        .catch(err => {
            document.getElementById('price-tkb').innerText = '-'
            document.getElementById('price-tkb-msg').innerText = err.reason
        })
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
        const signer = provider.getSigner();
        signerAddress = await signer.getAddress();

        //const scrollSepoliaProvider = new ethers.providers.JsonRpcProvider('https://scroll-sepolia-rpc.publicnode.com')
        TokenA.connectContract(signer)
        TokenB.connectContract(signer)

        simpleDExContract = new ethers.Contract(
            SIMPLE_DEx_ADDRESS,
            [{"inputs":[{"internalType":"contract ERC20","name":"_tokenA","type":"address"},{"internalType":"contract ERC20","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedAForB","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedBForA","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidityPoolTKB","type":"uint256"}],"name":"UpdatedLiquidity","type":"event"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidityPoolTokenB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountA","type":"uint256"},{"internalType":"uint256","name":"_amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountAIn","type":"uint256"}],"name":"swapAForB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountBIn","type":"uint256"}],"name":"swapBForA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
            signer
        )
    
        document.getElementById("navbar--login").innerHTML = `
            <h4>${signerAddress}</h4>
            <button onclick="onClickBtnLogout()">Disconnect my wallet</button>
        `
        document.getElementById('content').hidden=false
        document.getElementById('content-alt').hidden=true
    }

    function onClickBtnLogout(){
        document.getElementById("navbar--login").innerHTML = `
            <button onclick="onClickBtnLogin()">Connect my wallet</button>
        `
        signerAddress = null
        
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

        let promise = null; 
        let token = null
        if(tokenIn == 'A'){
            token = TokenA
            promise = simpleDExContract.swapAForB
        } else{
            token = TokenB
            promise = simpleDExContract.swapBForA
        }

        const adjustedAmmount = unit === 'Weis'? ammount: tkToWeis(ammount, token)
        
        promise(adjustedAmmount).then(
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

        let token = liquidityToken == 'A'? TokenA: TokenB
        
        const adjustedAmmount = liquidityUnit === 'Weis'? liquidityAmmount: tkToWeis(liquidityAmmount, token)
        
        const args = liquidityToken == TokenA.name?
            [adjustedAmmount, 0]: [0, adjustedAmmount]

        promise(...args)
            .then(tx=> tx.wait())
            .then(()=>alert('Succesfull transaction. To read the updated status, refresh both datasets'))
            .catch(err => {
                document.getElementById('liquidity-error').innerText = err.reason
            })
    }

function onSubmitFormMintMoney(form, event){
    event.preventDefault()

    const elements = form.elements
    const mintUnit = elements['mintUnit'].value
    const mintToken = elements['mintToken'].value
    const mintReciever = elements['mintReciever'].value
    const mintAmmount = elements['mintAmmount'].value

    const token = mintToken === TokenA.name? tkaContract: tkbContract
    
    const adjustedAmmount = mintUnit === 'Weis'? mintAmmount: tkToWeis(mintAmmount, mintToken === TokenA.name? TokenA: TokenB)
    
    token.mint(mintReciever, adjustedAmmount)
        .then(tx=>tx.wait()).then(()=>alert('Succesfull transaction. To read the updated status, refresh both datasets'))
        .catch(err => {
            document.getElementById('mint-error').innerText = err.reason
        })
}