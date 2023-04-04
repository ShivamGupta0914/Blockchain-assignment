//SPDX-License-Identifier:MIT

pragma solidity 0.8.19;
import "./IERC20.sol";

contract Minter {
    IERC20 private shivaToken;
    address private fromAddress;
    event Transfer(address from, address to, uint256 amount);

    constructor(address _tokenAddress, address _fromAddress) {
        shivaToken = IERC20(_tokenAddress);
        fromAddress = _fromAddress;
    }

    function getToken() external {
        uint256 balance = shivaToken.balanceOf(fromAddress);
        uint256 amountToBeTransfer = (((balance) * (3)) / (100));
        require(amountToBeTransfer !=0, "can not send anymore");
        shivaToken.transferFrom(
            fromAddress,
            msg.sender,
            amountToBeTransfer
        );
        emit Transfer(fromAddress, msg.sender, amountToBeTransfer);
    }
}
