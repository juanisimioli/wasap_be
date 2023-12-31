const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  [deployer] = await ethers.getSigners();
  const Wasap_v1 = await ethers.getContractFactory("Wasap_v1");
  const wasap_v1 = await upgrades.deployProxy(Wasap_v1, [
    await deployer.getAddress(),
  ]);
  await wasap_v1.waitForDeployment();
  console.log("Wasap v1 deployed to:", await wasap_v1.getAddress());
}

main();
