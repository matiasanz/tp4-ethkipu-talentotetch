let signerAddress = null

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

    SimpleDEx.getLiquidityPoolTokenA(TokenA)
        .then(lp => document.getElementById('lp-tka').innerText = lp)

    SimpleDEx.getLiquidityPoolTokenB(TokenB)
        .then(lp => document.getElementById('lp-tkb').innerText = lp)

    SimpleDEx.getPrice(TokenA)
        .then(price => document.getElementById('price-tka').innerText = price )
        .catch(err => {
            document.getElementById('price-tka').innerText = '-'
            document.getElementById('price-tka-msg').innerText = err.reason ?? err
        })

    SimpleDEx.getPrice(TokenB)
        .then(price => document.getElementById('price-tkb').innerText = price)
        .catch(err => {
            document.getElementById('price-tkb').innerText = '-'
            document.getElementById('price-tkb-msg').innerText = err.reason ?? err
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

        SimpleDEx.initialize(signer)
    
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

        let doSwap = null; 
        let token = null
        if(tokenIn == 'A'){
            token = TokenA
            doSwap = a => SimpleDEx.swapAForB(a)
        } else{
            token = TokenB
            doSwap = b => SimpleDEx.swapBForA(b)
        }

        const adjustedAmmount = unit === 'Weis'? ammount: token.convertTKToWeis(ammount)
        
        doSwap(adjustedAmmount)
            .then(()=>alert('Succesfull transaction. To read the updated status, refresh both datasets'))
            .catch(err => document.getElementById('swap-error').innerText = err.reason ?? err)
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
        
        const doModification = liquidityVerb === 'Add'? 
            l => SimpleDEx.addLiquidity(l): l => SimpleDEx.removeLiquidity(l)

        let token = liquidityToken == 'A'? TokenA: TokenB
        
        const adjustedAmmount = liquidityUnit === 'Weis'? liquidityAmmount: token.convertTKToWeis(liquidityAmmount)
        
        const args = liquidityToken == TokenA.name?
            [adjustedAmmount, 0]: [0, adjustedAmmount]

        doModification(...args)
            .then(()=>alert('Succesfull transaction. To read the updated status, refresh both datasets'))
            .catch(err => {
                document.getElementById('liquidity-error').innerText = err.reason ?? err
            })
    }

function onSubmitFormMintMoney(form, event){
    event.preventDefault()

    const elements = form.elements
    const mintUnit = elements['mintUnit'].value
    const mintToken = elements['mintToken'].value
    const mintReciever = elements['mintReciever'].value
    const mintAmmount = elements['mintAmmount'].value

    const token = mintToken === TokenA.name? TokenA: TokenB
    
    const adjustedAmmount = mintUnit === 'Weis'? mintAmmount: (mintToken === TokenA.name? TokenA: TokenB).convertTKToWeis(mintAmmount)
    
    token.mint(mintReciever, adjustedAmmount)
        .then(()=>alert('Succesfull transaction. To read the updated status, refresh both datasets'))
        .catch(err => {
            document.getElementById('mint-error').innerText = err.reason ?? err
        })
}