const { ethers, defender } = require("hardhat");
require("dotenv").config();

const { SEPOLIA_WASAP_CONTRACT_ADDRESS } = process.env;

async function main() {
  const Wasap_v2 = await ethers.getContractFactory("Wasap_v2");

  const proposal = await defender.proposeUpgradeWithApproval(
    SEPOLIA_WASAP_CONTRACT_ADDRESS,
    Wasap_v2,
    { redeployImplementation: "always" }
  );

  console.log(`Upgrade proposed with URL: ${proposal.url}`);
}

main();
