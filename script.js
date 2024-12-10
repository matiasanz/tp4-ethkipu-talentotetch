
class Token{
    constructor(address, abi, name, decimals, ){
        this.address = address
        this.abi = abi

        this.name = name
        this.decimals = decimals
    }
}

let signer = null; //Usuario


// Login
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
    function onClickBtnSwitchTokenToSwap(){
        const tokenIn = document.getElementById('form-swap--tokenIn--id')
        tokenIn.innerText = tokenIn.innerText === 'A'? 'B': 'A'
        document.getElementById('form-swap--tokenOut--id').innerText = tokenIn.innerText === 'A'? 'B': 'A'
    }

    //Setup inicial
    onClickBtnSwitchTokenToSwap()
