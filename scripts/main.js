// Global values
let signerAddress = null // Address of wallet selected to operate.

// Triggers

    // Navbar:

        // Connect my wallet
        /** Checks if metamask is installed and then gets from it the account's address and initializes all three
         * contracts by setting it for signer of transactions
         */
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

        // Disconnect my wallet
        /** Drops wallet information & hides menu */
        function onClickBtnLogout(){
            document.getElementById("navbar--login").innerHTML = `
                <button onclick="onClickBtnLogin()">Connect my wallet</button>
            `
            signerAddress = null
            TokenA.disconnect()
            TokenB.disconnect()
            SimpleDEx.disconnect()
            
            document.getElementById('content').hidden=true
            document.getElementById('content-alt').hidden=false
        }

    // Content
        // Account Status
        /** Gets information of balance and allowance of both tokens (A & B) and presents it in a table */
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
                        <td><span id="balance-tka">loading...</span> TK</td>
                        <td><span id="allowance-tka">loading...</span> TK</td>
                    </tr>
                    <tr>
                        <td>Token B</td>
                        <td><span id="balance-tkb">loading...</span> TK</td>
                        <td><span id="allowance-tkb">loading...</span> TK</td>
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

        // Liquidity pools
        /** Gets information of liquidity pools and prices of both tokens (A & B) and presents it in a table */
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
                    <td><span id="lp-tka">loading...</span> TK</td>
                    <td><span id="price-tka">loading...</span></td>
                </tr>
                <tr>
                    <td id="price-tka-msg" colspan="3"></td>
                </tr>
                <tr>
                    <td>Token B</td>
                    <td><span id="lp-tkb">loading...</span> TK</td>
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

        // Exchanging
            /** Swaps selected token from wallet's balance, with liquidity pool's balance */
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
                
                const button = elements['swapSubmit']
                const msg = document.getElementById('swap-msg')
                processSubmit(button, msg, () => doSwap(adjustedAmmount))
            }

            /** Switches selected token to swap: 'A for B' <-> 'B for A' */
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

        // Owner's tools: Theese can only be executed if the wallet has role of 'Owner' in SimpleDEx contract.

            // Manage liquidity
            /** Increments or removes liquidity in the ammount of the input. 
             * In case of increment, it will depend of wallet's balance, while
             * if it is a removement, it will depend on 
             */
            function onSubmitFormManageLiquidity(form, event){
                event.preventDefault()
                const elements = form.elements
                let liquidityAmmount = elements['liquidityAmmount'].value
                const liquidityUnit = elements['liquidityUnit'].value
                const liquidityVerb = elements['liquidityVerb'].value
                const liquidityToken = elements['liquidityToken'].value
                
                const doModification = liquidityVerb === 'Add'? 
                    (la, lb) => SimpleDEx.addLiquidity(la, lb): (la, lb) => SimpleDEx.removeLiquidity(la, lb)

                let token = liquidityToken == 'A'? TokenA: TokenB
                
                const adjustedAmmount = liquidityUnit === 'Weis'? liquidityAmmount: token.convertTKToWeis(liquidityAmmount)
                
                const args = liquidityToken == TokenA.name?
                    [adjustedAmmount, 0]: [0, adjustedAmmount]

                const msg = document.getElementById('liquidity-msg')
                const button = elements['liquiditySubmit']
            
                processSubmit(button, msg, ()=>doModification(...args))
            }

        // Mint money
        /** Mints total number of tokens in weis or in its respective unit and sends it
         * to the wallet wich address is written the input
         */
        function onSubmitFormMintMoney(form, event){
            event.preventDefault()

            const elements = form.elements
            const mintUnit = elements['mintUnit'].value
            const mintToken = elements['mintToken'].value
            const mintReciever = elements['mintReciever'].value
            const mintAmmount = elements['mintAmmount'].value

            const token = mintToken === TokenA.name? TokenA: TokenB
            
            const adjustedAmmount = mintUnit === 'Weis'? mintAmmount: (mintToken === TokenA.name? TokenA: TokenB).convertTKToWeis(mintAmmount)
            
            const msg = document.getElementById('mint-msg')
            const button = elements['mintSubmit']
            
            processSubmit(button, msg, ()=>token.mint(mintReciever, adjustedAmmount))
        }

        // Utils 
            /** Returns time with format hh:mm:ss TIMEZONE. This is used to show time of last update of data*/
            function getTimeString(){
                return new Date().toTimeString().slice(0, 17)
            }

            /** Disables the button while transaction is not finalized, sets on it the legend 'in progress...'
             * and sets in 'msg' field the results
             */
            function processSubmit(button, msg, action){
                button.disabled = true
                button.title = 'in progress...'
                action()
                    .then(()=>{
                        msg.innerText = 'Succesfull transaction. To read the updated status, refresh both datasets'
                        msg.className = 'confirm-msg'
                    })
                    .catch(err => {
                        msg.innerText = err.reason ?? err
                        msg.className = 'error-msg'
                    })
                    .then(()=> {
                        button.disabled = false
                        button.title = ''
                    })
            }

// Setup
    onClickBtnLogout()
    onClickBtnSwitchTokenToSwap()