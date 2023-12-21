//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Betting {
    address payable[] public players;
    uint public minBet;
    uint public maxNoOfBets;
    address public manager;
    uint public randomResult;
    uint public tokenPrice = 0.01 ether;
    mapping(address => uint) public tokens;

    struct BetInfo {
        address player;
        uint totalBetAmount;
    }

    struct pplBetInfo {
        address better;
        uint BetAmt;
        uint betIndex;
    }

    pplBetInfo[] public pplBets;
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

    function setMaxBets(uint numberParticipate) public onlyManager {
        maxNoOfBets = numberParticipate;
    }

    function enterComp() public {
        players.push(payable(msg.sender));
        totalBets.push(BetInfo(msg.sender, 0));
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

    function getPlayerInfo() public view returns (address[] memory, uint[] memory) {
        address[] memory playerAddresses = new address[](players.length);
        uint[] memory playerIndexes = new uint[](players.length);

        for (uint i = 0; i < players.length; i++) {
            playerAddresses[i] = players[i];
            playerIndexes[i] = i;
        }

        return (playerAddresses, playerIndexes);
    }

    function bet(uint playerIndex, uint amount) payable public {
        require(tokens[msg.sender] >= minBet, "insufficient bet amount");

        totalBets[playerIndex].totalBetAmount += amount;
        pplBets.push(pplBetInfo(msg.sender, amount, playerIndex));

        tokens[msg.sender] -= amount;
    }

    function getRandomNumber() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(manager, block.timestamp)));
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "No players in the competition");

        randomResult = getRandomNumber();
        uint winnerIndex = randomResult % players.length; //winner index

        uint total_moneyEarned = 0;

        for (uint i = 0; i < players.length; i++) {
            total_moneyEarned += totalBets[i].totalBetAmount;
        }

        uint house_commission = (10 * total_moneyEarned) / 100;
        tokens[manager] += house_commission;
        uint winnings = total_moneyEarned - house_commission;

        uint count = 0;
        for (uint i = 0; i < pplBets.length; i++) {
            if (pplBets[i].betIndex == winnerIndex) {
                count++;
            }
        }

        uint indv_winnings = (winnings / count);

        for (uint i = 0; i < pplBets.length; i++) {
            if (pplBets[i].betIndex == winnerIndex) {
                tokens[pplBets[i].better] += indv_winnings;
            }
        }

        //reset
        for (uint i = 0; i < totalBets.length; i++) {
            totalBets[i].totalBetAmount = 0;
        }
        delete pplBets;
        delete players;
        count = 0;
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
