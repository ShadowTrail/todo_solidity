import WrongNetworkMessage from '../components/WrongNetworkMessage'
import ConnectWalletButton from '../components/ConnectWalletButton'
import TodoList from '../components/TodoList'
import { TaskContractAddress } from '../config'
import TaskAbi from '../../backend/build/contracts/TaskContract.json'
import { ethers } from 'ethers'
import { useState } from 'react'

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [isUserLoggedIn, setUserLoggedIn] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([])

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try{
      const {ethereum} = window
      if (!ethereum) {
        console.log("Metamask not detected")
        return
      }
      let chainId = await ethereum.request({method: 'eth_chainId'})
      console.log("Connected to chain: ", chainId)

      const ganacheChainId = '0x539'
      if(chainId != ganacheChainId){
        alert("You are not connected to Ganache testnet")
        setCorrectNetwork(false)
        return
      }else{
        setCorrectNetwork(true)
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log("Found Account ", accounts[0])
      setUserLoggedIn(true)
      setCurrentAccount(accounts[0])

    } catch(error){
      console.log(error)
    }

  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {


  }

  // Add tasks from front-end onto the blockchain
  const addTask = async e => {
    e.preventDefault() //avoid refresh

    let task = {
      taskText: input,
      isDeleted: false
    }
  
    try{
      const {ethereum} = window
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = provider.getSigner()
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
      
      TaskContract.addTask(task.taskText, task.isDeleted)
      .then(res =>{
        setTasks([...tasks, task])
        console.log('Added task')
      })
      .catch(error =>{
        console.log(error)
      })
      } else {
        console.log('Ethereum object does not exist')
      }

    } catch(error){
      console.log(error)
    }
  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = key => async () => {

  }

  return (
    <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
      {!isUserLoggedIn ? <ConnectWalletButton connectWallet={connectWallet} /> :
        correctNetwork ? <TodoList input = {input} setInput={setInput} addTask={addTask}/> : <WrongNetworkMessage />}
    </div>
  )
}

