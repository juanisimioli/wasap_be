const { upgrades } = require("hardhat");
const { parseEther } = require("ethers");
const { expect } = require("chai");

const mockedUsers = {
  user1data: {
    name: "Juani",
    avatar: "QmT9RRYnUsEdjwtqKGtDCscHK6XGC8xS6jJfp4iw36doM5",
  },
  user2data: {
    name: "Tina",
    avatar: "QmaQp886BsK1L6aPFzg8pVU6TENTqRDNbRDP4jQdLn3QJD",
  },
  user3data: {
    name: "Evil Marty",
    avatar: "QmeJxtZxkCozKoJD6bRw2XigaVQBgCkCCfdEuT15Z1PdvV",
  },
};

const { user1data, user2data, user3data } = mockedUsers;

function runTestsForCode_Wasap_v1_using(versionToTest) {
  describe(`Wasap_v1 code using version: ${versionToTest}`, async function () {
    let wasap, user1, user2, user3;

    beforeEach(async () => {
      [deployer, user1, user2, user3] = await ethers.getSigners();
      const Wasap_v1 = await ethers.getContractFactory(
        `Wasap_v${versionToTest}`
      );
      const wasap_v1 = await upgrades.deployProxy(Wasap_v1, [
        await deployer.getAddress(),
      ]);

      wasap = await wasap_v1.waitForDeployment();
      wasapAddress = await wasap.getAddress();

      if (versionToTest > 1) {
        for (let i = 2; i <= versionToTest; i++) {
          wasap = await upgrades.upgradeProxy(
            wasapAddress,
            await ethers.getContractFactory(`Wasap_v${i}`)
          );
        }
      }
    });

    describe("Version Contract ", function () {
      it("Should return same contract version as version requested", async function () {
        const versionContract = await wasap.getVersion();

        await expect(versionContract).to.equal(versionToTest);
      });
    });

    describe("Create Account", async function () {
      it("Should create an account, emit event and get correct user data", async function () {
        const account1 = await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await expect(account1)
          .to.emit(wasap, "AccountCreated")
          .withArgs(await user1.getAddress());

        const [userName, userAvatar] = await wasap
          .connect(user1)
          .getUserInfo(await user1.getAddress());

        await expect(user1data.name).to.equal(userName);
        await expect(user1data.avatar).to.equal(userAvatar);

        const allUsers = await wasap.connect(user1).getAllAppUsers();

        await expect([user1data.name, await user1.getAddress()]).to.deep.equal(
          allUsers[0]
        );
      });

      it("Should create multiples accounts and get correct user data", async function () {
        const account1 = await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await expect(account1)
          .to.emit(wasap, "AccountCreated")
          .withArgs(await user1.getAddress());

        const [userName1, userAvatar1] = await wasap
          .connect(user1)
          .getUserInfo(await user1.getAddress());

        await expect(user1data.name).to.equal(userName1);
        await expect(user1data.avatar).to.equal(userAvatar1);

        const account2 = await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await expect(account2)
          .to.emit(wasap, "AccountCreated")
          .withArgs(await user2.getAddress());

        const [userName2, userAvatar2] = await wasap
          .connect(user2)
          .getUserInfo(await user2.getAddress());

        await expect(user2data.name).to.equal(userName2);
        await expect(user2data.avatar).to.equal(userAvatar2);

        const account3 = await wasap
          .connect(user3)
          .createAccount(user3data.name, user3data.avatar);

        await expect(account3)
          .to.emit(wasap, "AccountCreated")
          .withArgs(await user3.getAddress());

        const [userName3, userAvatar3] = await wasap
          .connect(user3)
          .getUserInfo(await user3.getAddress());

        await expect(user3data.name).to.equal(userName3);
        await expect(user3data.avatar).to.equal(userAvatar3);

        const allUsers = await wasap.connect(user1).getAllAppUsers();

        await expect([
          [user1data.name, await user1.getAddress()],
          [user2data.name, await user2.getAddress()],
          [user3data.name, await user3.getAddress()],
        ]).to.deep.equal(allUsers);
      });
    });

    describe("Add contacts", function () {
      beforeEach(async () => {
        await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await wasap
          .connect(user3)
          .createAccount(user3data.name, user3data.avatar);
      });

      it("Should add contact to contact list and emit event", async function () {
        const nameUser2byUser1 = "User_2_name_by_user1";

        const user1_add_user2 = await wasap
          .connect(user1)
          .addContact(await user2.getAddress(), nameUser2byUser1);

        await expect(user1_add_user2)
          .to.emit(wasap, "ContactAdded")
          .withArgs(await user1.getAddress(), await user2.getAddress());

        const contactListUser1 = await wasap
          .connect(user1)
          .getUserContactList();

        await expect(contactListUser1[0].contactAddress).to.equal(
          await user2.getAddress()
        );
        await expect(contactListUser1[0].name).to.equal(nameUser2byUser1);
        await expect(contactListUser1[0].avatar).to.equal(user2data.avatar);

        const contactListUser2 = await wasap
          .connect(user2)
          .getUserContactList();

        await expect(contactListUser2[0].contactAddress).to.equal(
          await user1.getAddress()
        );
        await expect(contactListUser2[0].name).to.equal(user1data.name);
        await expect(contactListUser2[0].avatar).to.equal(user1data.avatar);
      });
    });

    describe("Send texts", async function () {
      beforeEach(async () => {
        await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await wasap
          .connect(user3)
          .createAccount(user3data.name, user3data.avatar);
      });

      it("Should send texts", async function () {
        await wasap
          .connect(user1)
          .addContact(await user2.getAddress(), "User_2_name_by_user1");

        const message1to2 = "Hola, como le va?";
        const message2to1 = "Todo bien, vos?";

        const msg1to2 = await wasap
          .connect(user1)
          .sendText(await user2.getAddress(), message1to2);

        await expect(msg1to2)
          .to.emit(wasap, "TextSent")
          .withArgs(await user1.getAddress(), await user2.getAddress());

        const msg2to1 = await wasap
          .connect(user2)
          .sendText(await user1.getAddress(), message2to1);

        await expect(msg2to1)
          .to.emit(wasap, "TextSent")
          .withArgs(await user2.getAddress(), await user1.getAddress());

        const msgsUser1 = await wasap
          .connect(user1)
          .readTexts(await user2.getAddress());

        const msgsUser2 = await wasap
          .connect(user2)
          .readTexts(await user1.getAddress());

        await expect(msgsUser1[0].sender).to.equal(await user1.getAddress());
        await expect(msgsUser1[0].text).to.equal(message1to2);
        await expect(msgsUser1[0].timestamp).to.be.greaterThan(0);
        await expect(msgsUser1[1].sender).to.equal(await user2.getAddress());
        await expect(msgsUser1[1].text).to.equal(message2to1);
        await expect(msgsUser1[1].timestamp).to.be.greaterThan(0);

        await expect(msgsUser2[0].sender).to.equal(await user1.getAddress());
        await expect(msgsUser2[0].text).to.equal(message1to2);
        await expect(msgsUser2[0].timestamp).to.be.greaterThan(0);
        await expect(msgsUser2[1].sender).to.equal(await user2.getAddress());
        await expect(msgsUser2[1].text).to.equal(message2to1);
        await expect(msgsUser2[1].timestamp).to.be.greaterThan(0);
      });
    });

    describe("User Info", async function () {
      beforeEach(async () => {
        await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await wasap
          .connect(user1)
          .addContact(await user2.getAddress(), "User_2_name_by_user1");
      });

      it("should update user information", async function () {
        const user1InfoInitial = await wasap
          .connect(user1)
          .getUserInfo(await user1.getAddress());

        const user2InfoInitial = await wasap
          .connect(user2)
          .getUserInfo(await user2.getAddress());

        await expect(user1InfoInitial.name).to.equal(user1data.name);
        await expect(user1InfoInitial.avatar).to.equal(user1data.avatar);
        await expect(user2InfoInitial.name).to.equal(user2data.name);
        await expect(user2InfoInitial.avatar).to.equal(user2data.avatar);

        const user1newName = "1newName";
        const user1newAvatar = "1newAvatar";
        const user2newName = "2newName";
        const user2newAvatar = "2newAvatar";

        const updateInfo1 = await wasap
          .connect(user1)
          .updateUserInfo(user1newAvatar, user1newName);

        await expect(updateInfo1)
          .to.emit(wasap, "UserInfoUpdated")
          .withArgs(await user1.getAddress());

        const updateInfo2 = await wasap
          .connect(user2)
          .updateUserInfo(user2newAvatar, user2newName);

        await expect(updateInfo2)
          .to.emit(wasap, "UserInfoUpdated")
          .withArgs(await user2.getAddress());

        const user1updatedInfo = await wasap
          .connect(user1)
          .getUserInfo(await user1.getAddress());
        const user2updatedInfo = await wasap
          .connect(user2)
          .getUserInfo(await user2.getAddress());

        await expect(user1updatedInfo.name).to.equal(user1newName);
        await expect(user1updatedInfo.avatar).to.equal(user1newAvatar);
        await expect(user2updatedInfo.name).to.equal(user2newName);
        await expect(user2updatedInfo.avatar).to.equal(user2newAvatar);
      });
    });

    describe("Contact Info", async function () {
      const nameUser2byUser1 = "User_2_name_by_user1";
      const nameUser3byUser1 = "User_3_name_by_user1";

      beforeEach(async () => {
        await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await wasap
          .connect(user3)
          .createAccount(user3data.name, user3data.avatar);

        await wasap
          .connect(user1)
          .addContact(await user2.getAddress(), nameUser2byUser1);

        await wasap
          .connect(user1)
          .addContact(await user3.getAddress(), nameUser3byUser1);
      });

      it("should update contact information", async function () {
        const contactListUser1 = await wasap
          .connect(user1)
          .getUserContactList();

        // Check contact name and avatar from user2 and user3 before changes

        await expect(contactListUser1.length).to.equal(2);
        await expect(contactListUser1[0].contactAddress).to.equal(
          await user2.getAddress()
        );
        await expect(contactListUser1[0].name).to.equal(nameUser2byUser1);
        await expect(contactListUser1[0].avatar).to.equal(user2data.avatar);
        await expect(contactListUser1[1].contactAddress).to.equal(
          await user3.getAddress()
        );
        await expect(contactListUser1[1].name).to.equal(nameUser3byUser1);
        await expect(contactListUser1[1].avatar).to.equal(user3data.avatar);

        // Check contact name and avatar from user2 and user3 after changes

        const NEW_nameUser2byUser1 = "NEW_User_2_name_by_user1";
        const NEW_nameUser3byUser1 = "NEW_User_3_name_by_user1";

        const newNameUser2byUser1 = await wasap
          .connect(user1)
          .updateContactName(await user2.getAddress(), NEW_nameUser2byUser1);

        await expect(newNameUser2byUser1)
          .to.emit(wasap, "ContactInfoUpdated")
          .withArgs(await user1.getAddress(), await user2.getAddress());

        const newNameUser3byUser1 = await wasap
          .connect(user1)
          .updateContactName(await user3.getAddress(), NEW_nameUser3byUser1);

        await expect(newNameUser3byUser1)
          .to.emit(wasap, "ContactInfoUpdated")
          .withArgs(await user1.getAddress(), await user3.getAddress());

        // Check user name and avatar from user2 and user3 are not changed

        const user2Info = await wasap
          .connect(user2)
          .getUserInfo(await user2.getAddress());
        const user3Info = await wasap
          .connect(user3)
          .getUserInfo(await user3.getAddress());

        await expect(user2Info.name).to.equal(user2data.name);
        await expect(user2Info.avatar).to.equal(user2data.avatar);
        await expect(user3Info.name).to.equal(user3data.name);
        await expect(user3Info.avatar).to.equal(user3data.avatar);
      });
    });
  });
}

function runTestsForCode_Wasap_v2_using(versionToTest) {
  describe(`Wasap_v2 code using version: ${versionToTest}`, async function () {
    let wasap, user1, user2, user3;

    beforeEach(async () => {
      [deployer, user1, user2, user3] = await ethers.getSigners();
      const Wasap_v1 = await ethers.getContractFactory("Wasap_v1");
      const wasap_v1 = await upgrades.deployProxy(Wasap_v1, [
        await deployer.getAddress(),
      ]);

      wasap = await wasap_v1.waitForDeployment();
      wasapAddress = await wasap.getAddress();

      if (versionToTest > 1) {
        for (let i = 2; i <= versionToTest; i++) {
          wasap = await upgrades.upgradeProxy(
            wasapAddress,
            await ethers.getContractFactory(`Wasap_v${i}`)
          );
        }
      }
    });

    describe("Send payments", async function () {
      beforeEach(async () => {
        await wasap
          .connect(user1)
          .createAccount(user1data.name, user1data.avatar);

        await wasap
          .connect(user2)
          .createAccount(user2data.name, user2data.avatar);

        await wasap
          .connect(user3)
          .createAccount(user3data.name, user3data.avatar);
      });

      describe("Version Contract", function () {
        it("Should return same contract version as version requested", async function () {
          const versionContract = await wasap.getVersion();

          await expect(versionContract).to.equal(versionToTest);
        });
      });

      describe("Send Payments", function () {
        it("Should send payments, emit event, and update balances", async function () {
          await wasap
            .connect(user1)
            .addContact(await user2.getAddress(), "User_2_name_by_user1");

          const etherToSend = "2";

          const balanceUser1Initial = await ethers.provider.getBalance(
            user1.address
          );
          const balanceUser2Initial = await ethers.provider.getBalance(
            user2.address
          );

          const payment1to2 = await wasap
            .connect(user1)
            .sendPayment(await user2.getAddress(), {
              value: parseEther(etherToSend),
            });

          await expect(payment1to2)
            .to.emit(wasap, "PaymentSent")
            .withArgs(await user1.getAddress(), await user2.getAddress());

          const transactionPayment = await payment1to2.wait();

          const gasUsedInTransactionByUser1 =
            transactionPayment.gasUsed * transactionPayment.gasPrice;

          const balanceUser1AfterPayment = await ethers.provider.getBalance(
            user1.address
          );
          const balanceUser2AfterPayment = await ethers.provider.getBalance(
            user2.address
          );

          const expectedBalanceUser1 =
            balanceUser1Initial -
            parseEther(etherToSend) -
            gasUsedInTransactionByUser1;

          const expectedBalanceUser2 =
            balanceUser2Initial + parseEther(etherToSend);

          expect(balanceUser1AfterPayment).to.be.equal(expectedBalanceUser1);
          expect(balanceUser2AfterPayment).to.be.equal(expectedBalanceUser2);
        });
      });
    });
  });
}

runTestsForCode_Wasap_v1_using(1);
runTestsForCode_Wasap_v1_using(2);

runTestsForCode_Wasap_v2_using(2);
