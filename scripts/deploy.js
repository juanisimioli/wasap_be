const hre = require("hardhat");

async function main() {
  const wasap = await hre.ethers.deployContract("Wasap");

  await wasap.waitForDeployment();

  console.log(`Wasap with deployed to ${wasap.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
