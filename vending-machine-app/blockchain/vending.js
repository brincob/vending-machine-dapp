/*import Web3 from 'web3'
const provier = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/d7f8db15ab6e482994c4df672218e754"
)

const web3 = new Web3(provier)
*/

const abi = [{ "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "donutBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getVendingMachineBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "purchase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "restock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const vendingMachineContract = web3 => {
    return new web3.eth.Contract(
        abi, "0xF1a8d92a3B1977915be1bF4AbffB38a7Bd01CfE2")
}

export default vendingMachineContract