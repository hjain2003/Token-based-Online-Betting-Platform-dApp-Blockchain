require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks:{
    sepolia:{
      url : "https://sepolia.infura.io/v3/e790c264beac4cc891122c485e3b9cdd",
      accounts: [process.env.METAMASK_PRIVATE_KEY]
    }
  }
};
