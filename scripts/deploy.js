const hre = require("hardhat");

async function main() {
  const wasap = await hre.ethers.deployContract("Wasap_1");

  await wasap.waitForDeployment();

  console.log(`Wasap_1 with deployed to ${wasap.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
