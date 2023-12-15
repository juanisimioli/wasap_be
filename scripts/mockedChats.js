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
    avatar: "QmS53QbN2foRoE7pv5xTbyWDDJbmmmx6xxF74R39XtkBP2",
  },
  user2data: {
    name: "B",
    avatar: "QmS53QbN2foRoE7pv5xTbyWDDJbmmmx6xxF74R39XtkBP2",
  },
};

const { user1data, user2data, user3data } = mockedUsers;

const createMockedChats = async (wasap) => {
  [user1, user2] = await ethers.getSigners();

  await wasap.connect(user1).createAccount(user1data.name, user1data.avatar);
  await wasap.connect(user2).createAccount(user2data.name, user2data.avatar);

  await wasap.connect(user1).addContact(await user2.getAddress(), "b");

  await wasap
    .connect(user1)
    .sendMessage(await user2.getAddress(), "Hola ma, como va?");

  await wasap
    .connect(user2)
    .sendMessage(await user1.getAddress(), "Bien hijo vos?");

  await wasap
    .connect(user1)
    .sendMessage(await user2.getAddress(), "Todo bien, que hacias?");

  await wasap
    .connect(user2)
    .sendMessage(await user1.getAddress(), "Vengo de gimnasia, vos?");

  await wasap
    .connect(user1)
    .sendMessage(await user2.getAddress(), "Por ir al super");

  await wasap
    .connect(user1)
    .sendMessage(await user2.getAddress(), "Estas con la chuli?");

  await wasap
    .connect(user2)
    .sendMessage(
      await user1.getAddress(),
      "No, se fue a la pile de tu hermano"
    );

  await wasap
    .connect(user2)
    .sendMessage(await user1.getAddress(), "Hacia mucho calor aca");

  await wasap
    .connect(user1)
    .sendMessage(await user2.getAddress(), "Si, aca tambien. No hay luz");

  await wasap
    .connect(user2)
    .sendMessage(await user1.getAddress(), "Que cagada");

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
