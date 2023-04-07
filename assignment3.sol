// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract A {
    uint256 public add;
    uint256 public sub;
    uint256 public initTotal;
    event AddEvent(uint256 a, uint256 b);
    event SubEvent(uint256 a, uint256 b);

    function addition(uint256 _paramToAdd) external payable {
        require(
            initTotal + _paramToAdd <= type(uint256).max,
            "add value is very high"
        );
        initTotal += _paramToAdd;
        add = initTotal;
        emit AddEvent(initTotal, _paramToAdd);
    }

    function subtract(uint256 _paramToSubtract) external payable {
        require(
            initTotal - _paramToSubtract >= 0,
            "subtract value is very high"
        );
        initTotal -= _paramToSubtract;
        sub = initTotal;
        emit SubEvent(initTotal, _paramToSubtract);
    }
}

contract B {
    uint256 public add;
    uint256 public sub;
    uint256 public initTotal = 1;
    uint256 public mul;
    address AcontractAddress;
    event MultiplyEvent(uint256 a, uint256 b, uint256 c);

    constructor(address _AcontractAddress) {
        AcontractAddress = _AcontractAddress;
    }

    function multiply(uint256 _paramToMultiply) external payable {
        (bool statusFindAdd, ) = AcontractAddress.delegatecall(
            abi.encodeWithSignature("addition(uint256)", _paramToMultiply)
        );
        require(statusFindAdd, "can not detach Add variable");
        (bool statusFindSub, ) = AcontractAddress.delegatecall(
            abi.encodeWithSignature("subtract(uint256)", _paramToMultiply)
        );
        require(statusFindSub, "can not detach Sub variable");
        require(
            add * sub * _paramToMultiply <= type(uint256).max,
            "Overflow happened"
        );
        mul = add * sub * _paramToMultiply;
        emit MultiplyEvent(add, sub, _paramToMultiply);
    }
}
