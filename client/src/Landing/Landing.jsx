import React, { useContext } from 'react'
import './Landing.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { BettingContext } from '../context/BettingContext';

const Landing = () => {
    const {connectWallet} = useContext(BettingContext);
    const navigate = useNavigate();

    const handleConnect=async()=>{
        await connectWallet();
        navigate('/main');
    }

  return (
    <div className='landing_main'>
        <h1>Welcome to the Crypto Betting Platform</h1>
        <br />
        <button id="connect" onClick={handleConnect}>Connect to Wallet</button>
    </div>
  )
}

export default Landing
