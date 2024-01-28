import React, { useEffect, useState } from 'react'
import {ethers} from "ethers";
import { contractABI,contractAddress } from '../utils/constants.js';
import { useNavigate } from 'react-router-dom';

export const BettingContext = React.createContext();

const {ethereum} = window;

const createEthereumContract=()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const BettingContract = new ethers.Contract(contractAddress,contractABI,signer);

    return BettingContract;
}

export const BettingProvider = ({children})=>{
    const navigate = useNavigate();

    const [currentAccount, setCurrentAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState(0);
    const [tokensOwned, setTokensOwned] = useState(0);
    const [players, setPlayers] = useState([]);
    const [isManager, setIsManager] = useState(true);


    const checkIfWalletIsConnected=async()=>{
        if(!ethereum)
            alert("Please install Metamask!");
        
        const accounts= await ethereum.request({method : 'eth_accounts'});

        console.log(accounts);
    }

    const connectWallet=async()=>{
        try {
            if(!ethereum)
                alert("Please install Metamask!!");

            const accounts= await ethereum.request({method : 'eth_requestAccounts'});
            
            if(accounts.length){
                setCurrentAccount(accounts[0]);
            }
            await fetchPlayers();

            if (currentAccount.toLowerCase() !== "0x4d6E31b3a1F95462707999e37E5803e9550b2841") {
                setIsManager(false);
                console.log("isManager set to false");
            }
            console.log(currentAccount);

        } catch (error) {
            console.log(error);
        }
    }

    const fetchPlayers = async () => {
        try {
          const bettingContract = createEthereumContract();
          const updatedPlayers = await bettingContract.getPlayers();
          setPlayers(updatedPlayers);
          console.log("Updated Players:", updatedPlayers);
        } catch (error) {
          console.log(error);
        }
      }

    const getAccountBalance = async () => {
        try {
          if (currentAccount) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const balance = await provider.getBalance(currentAccount);
            const formattedBalance = parseFloat(
                ethers.utils.formatEther(balance)
              ).toFixed(4)
            setAccountBalance(formattedBalance);
          }
        } catch (error) {
          console.error('Error fetching account balance:', error);
        }
      };
      

    const buyTokens=async(numberTokens)=>{
        try {
            const BettingContract = createEthereumContract();

            const transaction = await BettingContract.buyTokens(numberTokens,{value : ethers.utils.parseEther((0.1 * numberTokens).toString())})

            await transaction.wait();

            getAccountBalance();
            getNumTokens();

        } catch (error) {
            console.log(error);
        }
    }

    const getNumTokens=async()=>{
        const bettingContract = createEthereumContract();

        const numOwnedBigNumber = await bettingContract.getNumberTokens();
        const numOwned = numOwnedBigNumber.toNumber();
        setTokensOwned(numOwned);
    }

    const withdrawTokens = async (withdrawAmount) => {
        try {
            const BettingContract = createEthereumContract();

            const withdrawTransaction = await BettingContract.withdrawTokens(withdrawAmount);

            await withdrawTransaction.wait();

            getAccountBalance();
            getNumTokens();
        } catch (error) {
            console.error('Error withdrawing tokens:', error);
        }
    };

    const enterCompetition = async () => {
        try {
            const bettingContract = createEthereumContract();

            await bettingContract.enterComp();

            await fetchPlayers();

        } catch (error) {
            console.log(error);
        }
    };

    const betOnPlayer = async (player, guessPosition, betAmount) => {
        try {
          const bettingContract = createEthereumContract();
          await bettingContract.bet(player, guessPosition, betAmount);

        } catch (error) {
          console.error('Error placing bet:', error);
        }
      };

      const pickWin = async()=>{
        try {
            const BettingContract = createEthereumContract();
             await BettingContract.pickWinner();

             await fetchPlayers();

        } catch (error) {
            console.log(error);
        }
      }


    useEffect(()=>{
        checkIfWalletIsConnected();
        getAccountBalance();
        getNumTokens();

    },[currentAccount])

    return(
        <BettingContext.Provider value={{connectWallet, currentAccount, accountBalance, buyTokens, tokensOwned, withdrawTokens, enterCompetition, fetchPlayers, players, betOnPlayer, pickWin, isManager}}>
            {children}
        </BettingContext.Provider>
    )
}