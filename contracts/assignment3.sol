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
        unchecked {
            initTotal += _paramToAdd;
            add = initTotal;
        }
        emit AddEvent(initTotal, _paramToAdd);
    }

    function subtract(uint256 _paramToSubtract) external {
        unchecked {
            initTotal -= _paramToSubtract;
            sub = initTotal;
        }
        emit SubEvent(initTotal, _paramToSubtract);
    }

    fallback(bytes calldata data) external payable returns (bytes memory) {
        bytes memory result;
        if (data.length == 36) {
            uint256 arg1 = abi.decode(data[4:], (uint256));
            (bool status, ) = BcontractAddress.delegatecall(
                abi.encodeWithSignature("multiply(uint256)", arg1)
            );
            require(status, "can not detach data");
            return result;
        } else {
            return result;
        }
    }
}

contract B {
    uint256 public add;
    uint256 public sub;
    uint256 public initTotal;
    event MultiplyEvent(uint256 a, uint256 b, uint256 c);

    function multiply(uint256 _paramToMultiply) external payable {
        unchecked {
            initTotal = (add - sub) * _paramToMultiply;
        }
        emit MultiplyEvent(add, sub, _paramToMultiply);
    }
}
