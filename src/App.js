import React, { useState } from 'react'
import { ethers } from 'ethers'

import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'
import './App.css'

const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const tokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

function App() {
  const [greeting, setGreetingValue] = useState()
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState(0)

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log('Balance: ', balance.toString())
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transation = await contract.transfer(userAccount, amount)
      await transation.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  const requestAccount = async() => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const fetchGreeting = async() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        greeterAddress, 
        Greeter.abi, 
        provider
      )
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log('Error: ', err)
      }
    } 
  }

  const setGreeting = async() => {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)} 
          placeholder="Set greeting"
          value={greeting} />
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input 
          onChange={e => setUserAccount(e.target.value)} 
          placeholder="Account ID" 
        />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>

    </div>
  )
}

export default App
