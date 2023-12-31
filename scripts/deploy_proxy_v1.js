const { ethers, defender } = require("hardhat");
require("dotenv").config();

async function main() {
  const Wasap_v1 = await ethers.getContractFactory("Wasap_v1");

  const upgradeApprovalProcess = await defender.getUpgradeApprovalProcess();

  if (upgradeApprovalProcess.address === undefined) {
    throw new Error(
      `Upgrade approval process with id ${upgradeApprovalProcess.approvalProcessId} has no assigned address`
    );
  }

  const deployment = await defender.deployProxy(
    Wasap_v1,
    [upgradeApprovalProcess.address],
    { initializer: "initialize" }
  );

  await deployment.waitForDeployment();

  console.log(`Contract deployed to ${await deployment.getAddress()}`);
}

main();
