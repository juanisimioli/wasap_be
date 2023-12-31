require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const { ETHERSCAN_API_KEY, DEFENDER_KEY, DEFENDER_SECRET } = process.env;

module.exports = {
  solidity: "0.8.20",
  defender: {
    apiKey: DEFENDER_KEY,
    apiSecret: DEFENDER_SECRET,
  },
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
