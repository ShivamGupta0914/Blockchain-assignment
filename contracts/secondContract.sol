// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract B {
    uint256 private value;

    function getValue() external view returns(uint256){
        return value;
    }
    function incrementValue() external {
        value++;
    }
}
