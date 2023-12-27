// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Wasap_v2 {
    error UserAlreadyExist();
    error UserNameCannotBeEmpty();
    error UserIsNotRegistered();
    error CreateAnAccountFirst();
    error NewContactIsNotRegistered();
    error CannotAddYourselfAsAContact();
    error UsersAlreadyContacts();
    error YouAreNotContactWithGivenUser();
    error InvalidAddress();

    event AccountCreated(address user);
    event ContactAdded(address user, address contact);
    event TextSent(address user, address contact);
    event UserInfoUpdated(address user);
    event ContactInfoUpdated(address user, address contact);

    struct User {
        string avatar;
        string name;
        Contact[] contactList;
    }

    struct Contact {
        address contactAddress;
        string name;
    }

    struct ContactWithAvatar {
        address contactAddress;
        string name;
        string avatar;
    }

    struct Text {
        address sender;
        uint256 timestamp;
        string text;
    }

    struct AllUsers {
        string name;
        address userAddress;
    }

    uint8 public constant VERSION = 2;

    AllUsers[] getAllUsers;

    // all registered users in our application
    mapping(address => User) userList;

    mapping(bytes32 => Text[]) allTexts;

    // IMPLEMENTS PAYMENTS VARIABLES
    struct Payment {
        address sender;
        uint256 timestamp;
        uint256 amount;
    }

    error IncorrectPaymentAmount();
    error InsufficientBalance();
    error PaymentFailed();
    event PaymentSent(address sender, address recipient);

    mapping(bytes32 => Payment[]) allPayments;

    fallback() external {}

    receive() external payable {}

    function checkUserExists(address addressUser) public view returns (bool) {
        return bytes(userList[addressUser].name).length > 0; // TODO: why bytes? what happen if user name is empty string?
    }

    function getAllAppUsers() public view returns (AllUsers[] memory) {
        return getAllUsers;
    }

    function getUserInfo(
        address _address
    ) external view returns (string memory name, string memory avatar) {
        if (!checkUserExists(msg.sender)) revert UserIsNotRegistered();
        return (userList[_address].name, userList[_address].avatar);
    }

    function getUserContactList()
        external
        view
        returns (ContactWithAvatar[] memory)
    {
        Contact[] memory contactList = userList[msg.sender].contactList;

        ContactWithAvatar[]
            memory contactListWithAvatar = new ContactWithAvatar[](
                contactList.length
            );

        for (uint256 i; i < contactList.length; i++) {
            contactListWithAvatar[i] = ContactWithAvatar(
                contactList[i].contactAddress,
                contactList[i].name,
                userList[contactList[i].contactAddress].avatar
            );
        }

        return contactListWithAvatar;
    }

    function _checkAlreadyContacts(
        address _user1,
        address _user2
    ) private view returns (bool) {
        // iterate over the array with fewer users
        if (
            userList[_user1].contactList.length >
            userList[_user2].contactList.length
        ) {
            address temp = _user1;
            _user1 = _user2;
            _user2 = temp;
        }

        for (uint256 i; i < userList[_user1].contactList.length; i++) {
            if (userList[_user1].contactList[i].contactAddress == _user2)
                return true;
        }

        return false;
    }

    function _addContact(
        address _userAddress,
        address _contactAddress,
        string memory _contactName
    ) private {
        userList[_userAddress].contactList.push(
            Contact(_contactAddress, _contactName)
        );
    }

    function _getChatCode(
        address _user1,
        address _user2
    ) internal pure returns (bytes32) {
        if (_user1 < _user2) {
            return keccak256(abi.encodePacked(_user1, _user2));
        } else {
            return keccak256(abi.encodePacked(_user2, _user1));
        }
    }

    function createAccount(
        string calldata _name,
        string calldata _avatar
    ) external {
        if (checkUserExists(msg.sender)) revert UserAlreadyExist();
        if (bytes(_name).length == 0) revert UserNameCannotBeEmpty();

        userList[msg.sender].avatar = _avatar;
        userList[msg.sender].name = _name;

        getAllUsers.push(AllUsers(_name, msg.sender)); // TODO: improveArrays? min 22

        emit AccountCreated(msg.sender);
    }

    function addContact(
        address _contactAddress,
        string calldata _contactName
    ) external {
        if (!checkUserExists(msg.sender)) revert CreateAnAccountFirst();
        if (!checkUserExists(_contactAddress))
            revert NewContactIsNotRegistered();
        if (msg.sender == _contactAddress) revert CannotAddYourselfAsAContact();
        if (_checkAlreadyContacts(msg.sender, _contactAddress))
            revert UsersAlreadyContacts();
        if (_contactAddress == address(0)) revert InvalidAddress();

        _addContact(msg.sender, _contactAddress, _contactName);
        _addContact(_contactAddress, msg.sender, userList[msg.sender].name);

        emit ContactAdded(msg.sender, _contactAddress);
    }

    function sendText(address _contactAddress, string calldata _text) external {
        if (!checkUserExists(msg.sender)) revert CreateAnAccountFirst();
        if (!checkUserExists(_contactAddress)) revert UserIsNotRegistered();
        if (!_checkAlreadyContacts(msg.sender, _contactAddress))
            revert YouAreNotContactWithGivenUser();

        bytes32 chatCode = _getChatCode(msg.sender, _contactAddress);

        Text memory newText = Text(msg.sender, block.timestamp, _text);

        allTexts[chatCode].push(newText);

        emit TextSent(msg.sender, _contactAddress);
    }

    function readTexts(
        address _contactAddress
    ) external view returns (Text[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, _contactAddress);

        return allTexts[chatCode];
    }

    function updateUserInfo(
        string calldata _userAvatar,
        string calldata _userName
    ) external {
        userList[msg.sender].name = _userName;
        userList[msg.sender].avatar = _userAvatar;

        emit UserInfoUpdated(msg.sender);
    }

    function updateContactName(
        address _contactAddress,
        string calldata _name
    ) external {
        if (bytes(_name).length == 0) revert UserNameCannotBeEmpty();

        Contact[] storage contactList = userList[msg.sender].contactList;

        for (uint256 i; i < contactList.length; i++) {
            if (contactList[i].contactAddress == _contactAddress) {
                contactList[i].name = _name;
                break;
            }
        }

        emit ContactInfoUpdated(msg.sender, _contactAddress);
    }

    // IMPLEMENTS PAYMENT METHODS

    function sendPayment(address payable _contactAddress) external payable {
        if (msg.value == 0) revert IncorrectPaymentAmount();
        if (!checkUserExists(msg.sender)) revert CreateAnAccountFirst();
        if (!checkUserExists(_contactAddress)) revert UserIsNotRegistered();
        if (!_checkAlreadyContacts(msg.sender, _contactAddress))
            revert YouAreNotContactWithGivenUser();

        (bool s, ) = _contactAddress.call{value: msg.value}("");
        if (!s) revert PaymentFailed();

        bytes32 paymentCode = _getChatCode(msg.sender, _contactAddress);

        Payment memory newPayment = Payment(
            msg.sender,
            block.timestamp,
            msg.value
        );

        allPayments[paymentCode].push(newPayment);

        emit PaymentSent(msg.sender, _contactAddress);
    }

    function readPayments(
        address _contactAddress
    ) external view returns (Payment[] memory) {
        bytes32 paymentCode = _getChatCode(msg.sender, _contactAddress);

        return allPayments[paymentCode];
    }
}
