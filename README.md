![Screenshot 2023-12-31 at 01 00 13](https://github.com/juanisimioli/wasap_fe/assets/48897558/ae8a7b9c-51ad-4460-ad25-b2212b0f4ebe)

# Wasap Smart Contract

Hello! I'm Juanisimioli, a frontend developer venturing into the blockchain ecosystem. I'm practicing by building decentralized applications (dapps) from scratch using NextJS 14 + Ethers 6.9 + Hardhat 2.19 + Solidity 0.8.18.

## Overview

Step into the future of messaging with our current chat app version deployed in December 2023 – a groundbreaking platform seamlessly integrating blockchain and conversation. Avatars are securely stored on the InterPlanetary File System (IPFS).

It's important to note that the current version lacks the proxy pattern, a feature I will be working on in January 2024. Once implemented, this enhancement will enable continuous updates and new features, including the highly anticipated ability for users to seamlessly send money to contacts directly within the application. Join me in shaping the next era of decentralized communication!

This dApp is developed for educational & learning purposes.

<br/>

## dApp

The application is developed entirely by Juanisimioli and is available for your use. Feel free to provide feedback or even consider hiring me!

The project is deployed and running on the Sepolia testnet. You can experience it live at [www.wasap.net.ar](https://www.wasap.net.ar). Please ensure you have MetaMask installed to interact with the dapp.

You can also explore the frontend repository [here](https://github.com/juanisimioli/wasap_fe) (built with NextJS 14 + Ethers 6.9).

**Note**: Please be aware that actual version 11.6.1 of MetaMask has reported bugs. For optimal performance, we strongly recommend using MetaMask version 11.5.2. Instructions on how to install this version can be found [here](https://support.metamask.io/hc/en-us/articles/360016336611-Revert-back-to-earlier-version-or-add-custom-build-to-Chrome).

**Note**: Complete the .env file with addresses and credentials. Refer to the .env.example file for guidance.

## Testing

To run tests, use the following command:

```shell
REPORT_GAS=true npx hardhat test
```

<br/>

# DEPLOYMENT

## Local Deployment

Start a local blockchain node with:

```shell
npx hardhat node
```

Deploy the contract on the localhost network:

```shell
npx hardhat run --network localhost scripts/deploy.js
```

**Note**: In your .env file, copy and paste the contract address to LOCALHOST_WASAP_CONTRACT_ADDRESS.

Run the script to create mocked chats:

```shell
npx hardhat run --network localhost scripts/mockedChats.js
```

<br/>

## Blockchain Deployment

To deploy on the Sepolia testnet, run:

```shell
npx hardhat run --network sepolia scripts/deploy.js
```

**Note**: In your .env file, copy and paste the contract address to SEPOLIA_WASAP_CONTRACT_ADDRESS.

<br/>

## Contract Verification

You can verify your contract code on Etherscan:

```shell
npx hardhat verify --network sepolia [contractAddress]

```

<br/>

## Contract ABI

Once the smart contract is compiled, find the ABI at this location:

```shell
/artifacts/contracts/Wasap.sol/Wasap.json.
```

You'll need the ABI to run the frontend repository locally.

<br/>

## Contact me

I would love to hear from you! Whether you have questions, feedback, or just want to connect, please don't hesitate to reach out via email at [juanisimioli@gmail.com](mailto:juanisimioli@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/juanisimioli/). Learning together in this community is a wonderful experience, and I'm always open to feedback and collaboration.

## Wasap Demo

(in progress)

## Other DApps Developed by Me:

Aerolineas: This dapp facilitates the purchase of flight tickets using cryptocurrency. Each seat from one destination to another on a specific flight is represented as an NFT. This allows users to perform various actions such as canceling reservations, purchasing tickets, making free transfer reservations, or even reselling tickets at a desired price for others to buy.
[Aerolineas Front End](https://github.com/juanisimioli/aerolineas_fe) /
[Aerolineas Back End](https://github.com/juanisimioli/aerolineas_be)
