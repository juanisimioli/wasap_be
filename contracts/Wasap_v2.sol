// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Wasap_v1} from "./Wasap_v1.sol";

contract Wasap_v2 is Wasap_v1 {
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

    function getVersion() public pure override returns (uint256) {
        return 2;
    }

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
