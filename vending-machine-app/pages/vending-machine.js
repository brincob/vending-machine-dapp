import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
//import vmContract from '../blockchain/vending'
import vendingMachineContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine = () => {
    // add an error variable and setError function
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    // create variable inventory to grab numberof inventory from the smart contract
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    //const [purchases, setPurchases] = (0)

    // declare a variable for web3
    //let web3

    useEffect(() => {
        // invoke getInventoryHandler function
        if (vmContract) getInventoryHandler()
        // invoke getMyDonutCountHandler function after connecting
        if (vmContract && address) getMyDonutCountHandler()
    },
        [vmContract, address]
    )

    // create a getInventoryHandler function
    const getInventoryHandler = async () => {
        // get VendingMachine balance from the smart contract/blockchain
        const inventory = await vmContract.methods.getVendingMachineBalance().call()
        setInventory(inventory)
    }

    const getMyDonutCountHandler = async () => {
        // get personal donutBalance associated with the address
        const count = await vmContract.methods.donutBalances(address).call()
        setMyDonutCount(count)
    }

    const updateDonutQty = event => {
        setBuyCount(event.target.value)
    }

    const buyDonutsHandler = async () => {
        try {
            await vmContract.methods.purchase(buyCount).send({
                from: address,
                value: web3.utils.toWei('2', 'ether') * buyCount
            })
            //setPurchases(purchases++)
            setSuccessMsg(`${buyCount} donuts purchased!`)

            if (vmContract) getInventoryHandler()
            // invoke getMyDonutCountHandler function after connecting
            if (vmContract && address) getMyDonutCountHandler()

        } catch (err) {
            setError(err.message)
        }

    }

    //Provider web3 global api object
    // window.ethereum - provider that allows us to request accounts from metamask
    // also allows users to sign messages and transactions and allows us to read data
    // from the blockchain we are connected to

    //setup a generic click handler for the button
    const connectWalletHandler = async () => {
        // check if metamask is available
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            // request wallet connect. Metamask pops up to connect
            try {
                // They have a metamask wallet, let them connect
                await window.ethereum.request({ method: "eth_requestAccounts" })
                // set variable web3 to become the new Web3 constructor function
                // which is the provider api
                web3 = new Web3(window.ethereum)
                setWeb3(web3)

                // get a list array of accounts from metamask
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                // call function vendingMachineContract from vending.js and create local contract copy 
                const vm = vendingMachineContract(web3)
                setVmContract(vm)


            } catch (err) {
                setError(err.message)

            }

        }
        else {
            // Do not have metamask, must install the wallet
            console.log('Please install MetaMask')
        }
    }

    return (
        <div className={styles.main}>
            <Head>
                <title>Vending Machine App</title>
                <meta name="description" content="A blockchain vending machine app" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar-brand">
                        <h1>Blockchain Vending Machine</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className="container">
                    <h2>Vending machine inventory: {inventory}</h2>
                </div>
            </section>
            <section>
                <div className="container">
                    <h2>My donuts: {myDonutCount}</h2>
                </div>
            </section>
            <section className="mt-5">
                <div className="container">
                    <div className="field">
                        <label className="label">Buy donuts</label>
                        <div className="control">
                            <input onChange={updateDonutQty} className="input" type="text" placeholder="Enter amount..." />
                        </div>
                        <button onClick={buyDonutsHandler} className="button is-primary mt-2">
                            Buy
                        </button>
                    </div>
                </div>
            </section>
            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className="container has-text-success">
                    <p>{successMsg}</p>
                </div>
            </section>
        </div>
    )
}

export default VendingMachine