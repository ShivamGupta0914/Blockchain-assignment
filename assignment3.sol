// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract A {
    uint256 public add;
    uint256 public sub;
    uint256 public initTotal;
    address BcontractAddress;
    event AddEvent(uint256 a, uint256 b);
    event SubEvent(uint256 a, uint256 b);

    constructor(address _BcontractAddress) {
        BcontractAddress = _BcontractAddress;
    }

    function addition(uint256 _paramToAdd) external {
        require(
            initTotal + _paramToAdd <= type(uint256).max,
            "add value is very high"
        );
        initTotal += _paramToAdd;
        add = initTotal;
        emit AddEvent(initTotal, _paramToAdd);
    }

    function subtract(uint256 _paramToSubtract) external {
        require(
            initTotal - _paramToSubtract >= 0,
            "subtract value is very high"
        );
        initTotal -= _paramToSubtract;
        sub = initTotal;
        emit SubEvent(initTotal, _paramToSubtract);
    }

    fallback() external payable{
        BcontractAddress.delegatecall(abi.encodeWithSignature("multiply(uint256)", 23));
    }

}

contract B {
    uint256 public add;
    uint256 public sub;
    uint256 public initTotal;
    event MultiplyEvent(uint256 a, uint256 b, uint256 c);

    function multiply(uint256 _paramToMultiply) external payable{

        require(
            (add -sub) * _paramToMultiply <= type(uint256).max,
            "Overflow happened"
        );
        initTotal = (add - sub) * _paramToMultiply;
        emit MultiplyEvent(add, sub, _paramToMultiply);
    }
}
