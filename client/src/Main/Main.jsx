import React, { useContext, useState } from 'react'
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { BettingContext } from '../context/BettingContext';

const Main = () => {
    const { connectWallet, accountBalance, currentAccount, buyTokens, tokensOwned, withdrawTokens, enterCompetition, pickWin} = useContext(BettingContext);

    const [buyBox, setBuyBox] = useState(false);
    const [withdrawBox, setWithdrawBox] = useState(false);
    const [numberOfTokens, setNumberOfTokens] = useState(0);
    const [withdrawNumTokens, setWithdrawNumTokens] = useState(0);

    const navigate = useNavigate();

    const openBuyPopUp = () => {
        setBuyBox(true);
    }

    const closeBtn = () => {
        setBuyBox(false);
    }

    const openWithdrawBox = () => {
        setWithdrawBox(true);
    }

    const closeWithdrawBox = () => {
        setWithdrawBox(false);
    }

    const handleBuyTokens = async () => {
        await buyTokens(numberOfTokens);
        setBuyBox(false);
    };

    const handleEnterCompetition = async () => {
        await enterCompetition();
    }

    const move = () => {
        navigate('/playerspace');
    }

    const handleWithdrawToken = async () => {
        await withdrawTokens(withdrawNumTokens);
        setWithdrawBox(false);
    }
    const handleWinner = async()=>{
        await pickWin();
    }

    return (
        <>

            <nav>
                <div className="imp_info">
                    <span className='highlight'><b>{currentAccount}</b></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="highlight"><b>Balance : {accountBalance} ETH </b></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className='highlight'><b>Tokens : {tokensOwned}</b></span>
                </div>
                <div className="nav_btns">
                    <button className="reconfigure" onClick={connectWallet}>Reconfigure</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button id="buy_tokens" onClick={openBuyPopUp}>Buy Tokens</button>
                    <button id="withdraw" onClick={openWithdrawBox}>Withdraw Tokens</button>
                </div>
            </nav>

            {

                (buyBox) && <div className="buy_box">
                    <b>Token Price : 0.1 ETH</b>
                    <br />
                    <label htmlFor="">Number of tokens</label>
                    <input type="number" name="" id="" onChange={(e) => setNumberOfTokens(e.target.value)} />
                    <br />
                    <div className="buy_cancel">
                        <button id="buyy" onClick={handleBuyTokens}>Buy</button>
                        &nbsp;&nbsp;&nbsp;
                        <button id="cancel" onClick={closeBtn}>Close</button>
                    </div>
                </div>
            }

            {
                (withdrawBox) && <div className="withdraw_box">
                    <b>1 Token = 0.1 ETH</b>
                    <br />
                    <label htmlFor="">Withdraw amount</label>
                    <input type="number" name="" id="" placeholder='Enter number of tokens' onChange={(e) => setWithdrawNumTokens(e.target.value)} />
                    <br />
                    <div className="buy_cancel">
                        <button id="buyy" onClick={handleWithdrawToken}>Withdraw</button>
                        &nbsp;&nbsp;&nbsp;
                        <button id="cancel" onClick={closeWithdrawBox}>Close</button>
                    </div>
                </div>
            }

            <div className="main_centre">
                <button id="bet" onClick={move}>Bet</button> &nbsp;&nbsp;&nbsp;
                <button id="pick_winner" onClick={handleWinner}>Pick Winner</button>&nbsp;&nbsp;&nbsp;
                <button id="participate" onClick={handleEnterCompetition}>Register as Player</button>
            </div>
        </>
    )
}

export default Main
