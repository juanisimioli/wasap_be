![Screenshot 2023-12-31 at 01 00 13](https://github.com/juanisimioli/wasap_fe/assets/48897558/ae8a7b9c-51ad-4460-ad25-b2212b0f4ebe)

# Wasap Smart Contract

Hello! I'm Juanisimioli, a frontend developer venturing into the blockchain ecosystem. I'm practicing by building decentralized applications (dapps) from scratch using NextJS 14 + Ethers 6.9 + Hardhat 2.19 + Solidity 0.8.20.

## Overview

### Upgradeable Smart Contracts:

Tackling the challenge of adaptability, this dApp employs upgradable smart contracts with a proxy contract architecture. After an upgrade, all states, including users and messages, remain intact. The transition is seamless, and the only addition to the smart contract is functionality, ensuring transparency in the upgrade process. With two versions available, Version 1 enables text messages, while Version 2 introduces the capability to send and receive Ether. Developers can seamlessly deploy Version 1, use it, and subsequently deploy Version 2, all while maintaining the same smart contract address.

### Security with OpenZeppelin Defender:

Addressing security challenges, smart contract upgradability is ensured through OpenZeppelin. OpenZeppelin Defender adds an extra layer of security by incorporating a multisignature wallet. This feature requires multiple approvals before deploying updates, enhancing the overall security posture.

### IPFS-Hosted Images:

Avatars from users within the application are securely hosted on IPFS (Interplanetary File System), ensuring decentralized and reliable access.

### Interactive Messaging with Event Management:

Engage in dynamic messaging within the application, encompassing both text and payment exchanges.
Smart contract events play a pivotal role in managing the status of message transmission and reception, creating an immersive and lifelike chat application experience.

This dApp is developed for educational & learning purposes.

> ```diff
> + Test Wasap on the Sepolia testnet by sending a message to my address:
> + 0x86B6181C7Ad521817191097F383748BCb4D62594
> ```
>
> [www.wasap.net.ar](https://www.wasap.net.ar)

<br/>

## dApp

The application is developed entirely by Juanisimioli and is available for your use. Feel free to provide feedback or even consider hiring me!

The project is deployed and running on the Sepolia testnet. You can experience it live at [www.wasap.net.ar](https://www.wasap.net.ar). Please ensure you have MetaMask installed to interact with the dapp.

You can also explore the frontend repository [here](https://github.com/juanisimioli/wasap_fe) (built with NextJS 14 + Ethers 6.9).

**Note**: Complete the .env file with addresses and credentials. Refer to the .env.example file for guidance.

## Testing

To run tests, use the following command:

```shell
npx hardhat test
```

<br/>

# DEPLOYMENT

## Local Deployment

Start a local blockchain node with:

```shell
npx hardhat node
```

Deploy the contract version 1 on the localhost network (enables only text messages)

```shell
npx hardhat run --network localhost scripts/deploy_v1.js
```

**Note**: In your .env file, copy and paste the contract address to LOCALHOST_WASAP_CONTRACT_ADDRESS.

Run the script to create mocked chats:

```shell
npx hardhat run --network localhost scripts/mockedChats.js
```

Deploy the contract version 2 on the localhost network (add feature of sending and receive Ether)

```shell
npx hardhat run --network localhost scripts/deploy_v2.js
```

<br/>

## Blockchain Deployment

First of all, you have to create an account on [OpenZeppelin Defender](https://www.openzeppelin.com/defender) and configure your [Deploy Environment](https://docs.openzeppelin.com/defender/v2/module/deploy).
For Deploy approval processes you can choose a Relayer, for Upgrade Approval Processes you can choose a multisignature wallet, in this case create an account in [Safe](https://safe.global/).

**Note**: In your .env file, copy and paste the DEFENDER_KEY and DEFENDER_SECRET variables.

To deploy version 1 (enables only text messages) on the Sepolia testnet, run:

```shell
npx hardhat run --network sepolia scripts/deploy_proxy_v1.js
```

To deploy version 2 (add feature of sending and receive Ether) on the Sepolia testnet, run:

```shell
npx hardhat run --network sepolia scripts/deploy_proxy_v1.js
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

## Wasap Video Demo

(in progress)

## Other DApps Developed by Me:

Aerolineas: This dapp facilitates the purchase of flight tickets using cryptocurrency. Each seat from one destination to another on a specific flight is represented as an NFT. This allows users to perform various actions such as canceling reservations, purchasing tickets, making free transfer reservations, or even reselling tickets at a desired price for others to buy.
[Aerolineas Front End](https://github.com/juanisimioli/aerolineas_fe) /
[Aerolineas Back End](https://github.com/juanisimioli/aerolineas_be)
