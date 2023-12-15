const { expect } = require("chai");

const mockedUsers = {
  user1data: {
    name: "Juani Simioli",
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

const { deployerUserData, user1data, user2data, user3data } = mockedUsers;

describe("Wasap", function () {
  let wasap, wasapAddress, deployer, user1, user2, user3;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();
    const Wasap = await ethers.getContractFactory("Wasap");

    wasap = await Wasap.deploy();

    await wasap.waitForDeployment();
    wasapAddress = await wasap.getAddress();
  });

  describe("Create Account", function () {
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
      const user1_add_user2 = await wasap
        .connect(user1)
        .addContact(await user2.getAddress(), "User_2_name_by_user1");

      await expect(user1_add_user2)
        .to.emit(wasap, "ContactAdded")
        .withArgs(await user1.getAddress(), await user2.getAddress());

      const a = await wasap.connect(user1).getUserContactList();
      const b = await wasap.connect(user2).getUserContactList();

      console.log({ a, b });
    });
  });

  describe("Send messages", async function () {
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
    it("should send messages", async function () {
      const user1_add_user2 = await wasap
        .connect(user1)
        .addContact(await user2.getAddress(), "User_2_name_by_user1");

      await wasap
        .connect(user1)
        .sendMessage(await user2.getAddress(), "Hola como le va");

      await wasap
        .connect(user2)
        .sendMessage(await user1.getAddress(), "Todo bien vos?");

      const msgsUser1 = await wasap
        .connect(user1)
        .readMessages(await user2.getAddress());

      const msgUser2 = await wasap
        .connect(user2)
        .readMessages(await user1.getAddress());

      console.log({ msgsUser1, msgUser2 });
    });
  });
});
