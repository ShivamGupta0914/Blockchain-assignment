const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Token contract", function () {

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("TokenImplement");
        const [owner, addr1, addr2] = await ethers.getSigners();
        const hardhatToken = await Token.deploy("Shiva Token", "SHIVA", 18);
        await hardhatToken.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { Token, hardhatToken, owner, addr1, addr2 };
    }

    it("Deployment should assign the total supply of tokens to the owner", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance / Math.pow(10, 18));
    });

    it("should use transfer correctly", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
        await hardhatToken.transfer(addr1.address, 100);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
    });

    it("should approve someone", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
        await hardhatToken.approve(addr1.address, 100);
        expect(await hardhatToken.allowance(owner.address, addr1.address)).to.equal(100);
    });

    it("should use transferFrom correctly", async function () {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        await hardhatToken.approve(addr1.address, 100);
        await hardhatToken.connect(addr1).transferFrom(owner.address, addr2.address, 100);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(100);
    });

    it("should return total supply of token", async function () {
        const { hardhatToken } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.totalSupply()).to.equal(1000);
    });

    it("should return balance of the account", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.balanceOf(owner.address) / Math.pow(10, 18)).to.equal(1000);
    })

    it("should return name of the token", async function () {
        const { hardhatToken } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.name()).to.equal("Shiva Token");
    });

    it("should return symbol of the token", async function () {
        const { hardhatToken } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.symbol()).to.equal("SHIVA");
    });

    it("should return decimals of the token", async function () {
        const { hardhatToken } = await loadFixture(deployTokenFixture);
        expect(await hardhatToken.decimals()).to.equal(18);
    });

    it("should return allowance correctly", async function () {
        const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
        await hardhatToken.approve(addr1.address, 100);
        expect(await hardhatToken.allowance(owner.address, addr1.address)).to.equal(100);
    });

});


describe("minterContract", function () {

    async function deployTokenFixture() {
        const shivaToken = await ethers.getContractFactory("TokenImplement");
        const myToken = await shivaToken.deploy("Shiva Token", "SHIVA", 18);
        await myToken.deployed();
        // console.log(myToken, myToken.address);
        const Mint = await ethers.getContractFactory("Minter");
        const [owner, addr1, addr2] = await ethers.getSigners();
        const MinterContract = await Mint.deploy(myToken.address, owner.address);
        await MinterContract.deployed();
     

        // Fixtures can return anything you consider useful for your tests
        return { shivaToken, myToken, MinterContract, owner, addr1, addr2 };
    }

    it("should transfer 3 percent of token to the caller account", async function () {
        const { myToken, MinterContract, owner, addr1} = await loadFixture(deployTokenFixture);
        await myToken.approve(MinterContract.address, BigInt(Math.pow(10,21)));
        expect(await myToken.allowance(owner.address, MinterContract.address)).to.equal(BigInt(Math.pow(10,21)));
        await MinterContract.connect(addr1).getToken();
        expect(await myToken.balanceOf(addr1.address)).to.equal(BigInt(Math.pow(10,21) * 0.03));
    });
});