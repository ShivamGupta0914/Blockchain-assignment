//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./IERC20.sol";

contract TokenImplement is IERC20 {
    string private tokenName;
    string private tokenSymbol;
    uint256 private tokenSupply = 1000;
    uint8 private tokenDecimals;
    address private _owner;
    mapping(address => uint256) private tokenBalance;
    mapping(address => mapping(address => uint256)) private approvalBalance;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) {
        tokenName = _name;
        tokenSymbol = _symbol;
        tokenDecimals = _decimals;
        _owner = msg.sender;
        tokenBalance[_owner] = tokenSupply * (10**tokenDecimals);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(tokenBalance[msg.sender] >= amount, "Insufficient amount");
        tokenBalance[msg.sender] -= amount;
        tokenBalance[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;    
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(msg.sender != spender, "Can not approve Yourself");
        approvalBalance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(from != to, "same from and to");
        require(
            tokenBalance[from] >= amount,
            "from does not have sufficient balance"
        );
        require(
            approvalBalance[from][msg.sender] >= amount,
            "Not Authorized Or Insufficient Balance"
        );
        approvalBalance[from][msg.sender] -= amount;
        tokenBalance[from] -= amount;
        tokenBalance[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function totalSupply() external view returns (uint256) {
        return tokenSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return tokenBalance[account];
    }

    function allowance(address owner, address spender)
        external
        view
        returns (uint256)
    {
        return approvalBalance[owner][spender];
    }

    function decimals() external view returns (uint8) {
        return tokenDecimals;
    }

    function name() external view returns (string memory) {
        return tokenName;
    }

    function symbol() external view returns (string memory) {
        return tokenSymbol;
    }
}
