import React, { useContext, useState } from 'react';
import './PlayerCard.css';
import { BettingContext } from '../context/BettingContext';

const PlayerCard = ({ playerId }) => {
    const {betOnPlayer} = useContext(BettingContext);

  const [betBox, setBetBox] = useState(false);
  const [betamt, setBetAmt] = useState(0);
  const [guesspos, setGuessPos] = useState(0);


  const openBetBox = () => {
    console.log(playerId);
    setBetBox(true);
  };

  const closeBetBox = () => {
    setBetBox(false);
  };

  const handleBet = async() => {
    await betOnPlayer(playerId,guesspos,betamt);

    closeBetBox();
  };
  const truncatedPlayerId = `${playerId.slice(0, 4)}...${playerId.slice(-3)}`;

  return (
    <>
      <div className='card'>
        {playerId}
        <button id="bet_on" onClick={openBetBox}>
          Bet
        </button>
      </div>

      {betBox && (
        <div className="bet_box">
          <h3>Bet on Player {truncatedPlayerId}:</h3>
          <br />
          <label htmlFor="">Bet Amount</label>
          <input type="number" onChange={(e) => setBetAmt(e.target.value)}/>
          <br />
          <label htmlFor="">Guess position</label>
          <input type="number" onChange={(e) => setGuessPos(e.target.value)}/>
          <br />
          <div className="bet_box_btns">
            <button id="bett" onClick={handleBet}>
              Bet
            </button>
            &nbsp;&nbsp;&nbsp;
            <button id="cancell" onClick={closeBetBox}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <br />
    </>
  );
};

export default PlayerCard;
