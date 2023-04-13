// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract A is Initializable{
    uint256 private value;

    function getValue() external view returns(uint256){
        return value;
    }

    function initialize(uint256 _valueToSet) external initializer {
        value = _valueToSet;
    }
}
