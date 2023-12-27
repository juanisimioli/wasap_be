// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const Wasap_v1 = await ethers.getContractFactory("Wasap_v1");
  const wasap_v1 = await upgrades.deployProxy(Wasap_v1);
  await wasap_v1.waitForDeployment();
  console.log("Wasap v1 deployed to:", await wasap_v1.getAddress());
}

main();
