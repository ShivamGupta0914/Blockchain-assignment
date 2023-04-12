// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract B {
    uint256 private value;

    function getValue() external view returns(uint256){
        return value;
    }

    function setValue(uint256 _valueToSet) external {
        value = _valueToSet;
    }
    
    function incrementValue() external {
        value++;
    }
}
