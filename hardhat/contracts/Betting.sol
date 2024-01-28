//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Betting {

    address payable[] public players;
    uint public minBet;
    address public manager;
    uint public randomResult;
    uint public tokenPrice = 0.1 ether;
    uint public totalTokens;
    mapping(address => uint) public tokens;
    mapping(address=>bool) public betAlreadyPlaced;

    struct BetInfo {
        address better;
        address player;
        uint BetAmount;
        uint guessPosition;
    }

    
    BetInfo[] public totalBets; 

    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Manager only area");
        _;
    }

    function buyTokens(uint number_tokens) payable public {
        require(msg.value >= tokenPrice * number_tokens, "insufficient funds");
        tokens[msg.sender] += number_tokens;
    }

    function getNumberTokens() public view returns(uint) {
        return tokens[msg.sender];
    }

    function setMinBetAmt(uint betTokens) public onlyManager {
        minBet = betTokens;
    }

    function enterComp() public {
        players.push(payable(msg.sender));
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

    function getTotalPool() public returns(uint){
        for (uint i = 0; i < totalBets.length; i++) {
            totalTokens += totalBets[i].BetAmount;
        }

        return totalTokens;
    }
  function bet(address payable _player, uint _guessPos, uint _amount) public {
    require(tokens[msg.sender] >= minBet, "Insufficient bet amount");
    require(_amount > minBet, "Invalid bet amount");
    require(!betAlreadyPlaced[msg.sender],"Bet already placed!");
    
    tokens[msg.sender] -= _amount;

    BetInfo memory newBet = BetInfo({
        better: msg.sender,
        player: _player,
        BetAmount: _amount,
        guessPosition: _guessPos
    });

    betAlreadyPlaced[msg.sender] = true;
    totalBets.push(newBet);
}


    function getRandomNumber() internal view returns(uint) {
        return uint(keccak256(abi.encodePacked(manager, block.timestamp)));
    }

    function pickWinner() public onlyManager {
    require(players.length > 0, "No players in the competition");

    randomResult = getRandomNumber();
    uint winnerIndex = randomResult % players.length; //winner index

    uint totalToken = getTotalPool();
    uint managerCut;


    // Calculate manager's cut (10% of totalTokens)
    managerCut = (totalToken * 10) / 100;
    tokens[manager] += managerCut;

    // Calculate the amount to be distributed among winners (90% of totalTokens)
    uint winnersCut = totalToken - managerCut;

    //loop to find out the total money bet by the winners combined
    uint total_bet_of_winners;
    for(uint i=0;i<totalBets.length;i++){
        if(totalBets[i].guessPosition == winnerIndex){
            total_bet_of_winners+=totalBets[i].BetAmount;
        }
    }

    // Loop through totalBets to find winners and distribute tokens
    for (uint i = 0; i < totalBets.length; i++) {
        if (totalBets[i].guessPosition == winnerIndex) {
            // This player is a winner
            uint playerShare = (totalBets[i].BetAmount * winnersCut) / total_bet_of_winners;
            tokens[totalBets[i].better] += playerShare;
        }
    }

    resetGame();
}

function resetGame() internal {
    // Reset game-related variables
    delete players;
    delete totalBets;
    randomResult = 0;
}


    function withdrawTokens(uint withdraw_token) public {
        require(withdraw_token <= tokens[msg.sender], "Not enough tokens");

        uint withdrawAmount = withdraw_token * tokenPrice;
        require(address(this).balance >= withdrawAmount, "Contract balance is insufficient");

        // Transfer ETH to the user
        payable(msg.sender).transfer(withdrawAmount);

        tokens[msg.sender] -= withdraw_token;
    }
}
