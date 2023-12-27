const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

const { LOCALHOST_WASAP_PROXY_CONTRACT_ADDRESS } = process.env;

async function main() {
  const Wasap_v2 = await ethers.getContractFactory("Wasap_v2");
  await upgrades.upgradeProxy(LOCALHOST_WASAP_PROXY_CONTRACT_ADDRESS, Wasap_v2);
  console.log("Upgraded to Wasap_v2");
}

main();
