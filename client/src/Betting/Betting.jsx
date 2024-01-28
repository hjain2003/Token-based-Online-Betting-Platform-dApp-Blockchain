import React, { useContext, useEffect, useState } from 'react';
import './Betting.css';
import PlayerCard from './PlayerCard';
import { BettingContext } from '../context/BettingContext';

const Betting = () => {
    const { connectWallet, accountBalance, currentAccount, tokensOwned, players, isManager } = useContext(BettingContext);

    const [minBet, setMinBet] = useState(false);

    const openMinBet = () => {
        setMinBet(true);
    };

    const closeMinBet = () => {
        setMinBet(false);
    };


    return (
        <>
            <nav>
                <div className="imp_info">
                    <span className='highlight'><b>{currentAccount}</b></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="highlight"><b>Balance : {accountBalance} ETH </b></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className='highlight'><b>Tokens : {tokensOwned}</b></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="highlight"><b>Min Bet : 0.1 ETH</b></span>
                </div>
                <div className="nav_btns">
                    <button className="reconfigure" onClick={connectWallet}>Reconfigure</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        isManager &&

                        <button id="set_bet_amt" onClick={openMinBet}>
                            Set Minimum Bet
                        </button>
                    }
                </div>
            </nav>

            {minBet && (
                <div className="set_bet_box">
                    <b>Set Minimum Bet Amount</b>
                    <br />
                    <label htmlFor="">Min Tokens for Betting</label>
                    <input type="number" name="" id="" placeholder="Enter number of tokens" />
                    <br />
                    <div className="buy_cancel">
                        <button id="buyy">Set</button>
                        &nbsp;&nbsp;&nbsp;
                        <button id="cancel" onClick={closeMinBet}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <h2>Players :</h2>
            <div className="players">
                {players.map((player) => (
                    <PlayerCard key={player} playerId={player} />
                ))}
            </div>
        </>
    );
};

export default Betting;
