require("dotenv").config();
const { ethers } = require("hardhat");
const { expect } = require("chai");

const contractAddress = {
  localhost: process.env.LOCALHOST_WASAP_CONTRACT_ADDRESS,
  sepolia: process.env.SEPOLIA_WASAP_CONTRACT_ADDRESS,
};

const mockedUsers = {
  user1data: {
    name: "A",
    avatar: "avatar1",
  },
  user2data: {
    name: "B",
    avatar: "avatar2",
  },
};

const { user1data, user2data, user3data } = mockedUsers;

const createMockedChats = async (wasap) => {
  [user1, user2] = await ethers.getSigners();

  await wasap.connect(user1).createAccount(user1data.name, user1data.avatar);
  await wasap.connect(user2).createAccount(user2data.name, user2data.avatar);

  await wasap.connect(user1).addContact(await user2.getAddress(), "b");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg01");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg02");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg03");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg04");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg05");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg06");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg07");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg08");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg09");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg10");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg11");

  await wasap.connect(user1).sendMessage(await user2.getAddress(), "Msg12");

  await wasap.connect(user2).sendMessage(await user1.getAddress(), "Msg13");

  console.log("Mocked chats done!");
};

async function main() {
  const wasap = await ethers.getContractAt(
    "Wasap",
    contractAddress[hre.network.name]
  );

  await createMockedChats(wasap);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
