const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Token contract", function () {
    const zero_address = "0x0000000000000000000000000000000000000000";
    async function deployFixture() {
        const Token = await ethers.getContractFactory("ERC721Token");
        const [deployer, user1, user2] = await ethers.getSigners();
        const token1 = await Token.deploy();
        console.log(token1.address);
        await token1.deployed();
        const bContract = await ethers.getContractFactory("B");
        const B = await bContract.deploy();
        console.log(B.address);
        await B.deployed();
        const cContract = await ethers.getContractFactory("C");
        const C = await cContract.deploy();
        await C.deployed();
        return { token1, B, C, deployer, user1, user2 };
    }

    it("should return address of the token owner", async function () {
        const { token1, deployer, user1 } = await loadFixture(deployFixture);
        expect(await token1.balanceOf(deployer.address)).to.equal(2);
    });

    it("should return balance of owner", async () => {
        const { token1, deployer } = await loadFixture(deployFixture);
        expect(await token1.balanceOf(deployer.address)).to.equal(2);
    });

    it("should approve correctly", async () => {
        const { token1, deployer, user1 } = await loadFixture(deployFixture);
        await expect(token1.approve(user1.address, 0)).to.emit(token1, "Approval").withArgs(deployer.address, user1.address, 0);
        expect(await token1.getApproved(0)).to.equal(user1.address);
        await expect(token1.approve(user1.address, 2)).to.be.revertedWith("owner does not own this token");
        await expect(token1.approve(zero_address, 2)).to.be.revertedWith("can not approve zero address");
    });

    it("transferFrom function should work correctly", async function () {
        const { token1, deployer, user1, user2 } = await loadFixture(deployFixture);
        expect(await token1.transferFrom(deployer.address, user1.address, 0)).to.emit(token1, "Transfer").withArgs(deployer.address, user1.address, 0);
        expect(await token1.ownerOf(0)).to.equal(user1.address);
        await expect(token1.transferFrom(deployer.address, user1.address, 0)).to.be.revertedWith("no such token available");
        await token1.connect(user1).approve(deployer.address, 0);
        await expect(token1.transferFrom(user1.address, user2.address, 2)).to.be.revertedWith("can not send token");
        expect(await token1.getApproved(0)).to.equal(deployer.address);
        expect(await token1.transferFrom(user1.address, user2.address, 0));
        expect(await token1.ownerOf(0)).to.equal(user2.address);
        await token1.connect(user2).setApprovalForAll(deployer.address, true);
        await token1.transferFrom(user2.address, deployer.address, 0);
    });

    it("setApprovalForAll should work correctly", async function () {
        const { token1, deployer, user1, user2 } = await loadFixture(deployFixture);
        expect(await token1.setApprovalForAll(user1.address, true)).to.emit(token1, "ApprovalForAll").withArgs(deployer.address, user1.address, false);
        expect(await token1.isApprovedForAll(deployer.address, user1.address)).to.equal(true);
        expect(await token1.isApprovedForAll(deployer.address, user2.address)).to.equal(false);
        await expect(token1.setApprovalForAll(zero_address, true)).to.be.revertedWith("can not approve zero address");
    });

    it("isApprovedForAll should work properly", async function () {
        const { token1, deployer, user1, user2 } = await loadFixture(deployFixture);
        expect(await token1.setApprovalForAll(user1.address, true)).to.emit(token1, "ApprovalForAll").withArgs(deployer.address, user1.address, false);
        expect(await token1.isApprovedForAll(deployer.address, user1.address)).to.equal(true);
        expect(await token1.isApprovedForAll(deployer.address, user2.address)).to.equal(false);
    });

    it("getApproved should work properly", async function () {
        const { token1, deployer, user1, user2 } = await loadFixture(deployFixture);
        expect(await token1.getApproved(5)).to.equal(zero_address);
    });

    it("safeTransferFrom without data should work properly", async function () {
        const { token1, B, C, deployer, user1, user2 } = await loadFixture(deployFixture);
        await expect(token1.functions['safeTransferFrom(address,address,uint256)'](deployer.address, user1.address, 0)).to.be.revertedWith("_to is not a contract account");
        await expect(token1.functions['safeTransferFrom(address,address,uint256)'](deployer.address, B.address, 0)).to.emit(token1, "Transfer").withArgs(deployer.address, B.address, 0);
        await expect(token1.functions['safeTransferFrom(address,address,uint256)'](deployer.address, C.address, 1)).to.be.revertedWith("_to contract does not implement ERC721Received");
    });

    it("safeTransferFrom with data should work properly", async function () {
        const { token1, B, C, deployer, user1, user2 } = await loadFixture(deployFixture);
        await expect(token1.functions['safeTransferFrom(address,address,uint256,bytes)'](deployer.address, user1.address, 0, "0x00")).to.be.revertedWith("_to is not a contract account");
        await expect(token1.functions['safeTransferFrom(address,address,uint256,bytes)'](deployer.address, B.address, 0, "0x00")).to.emit(token1, "Transfer").withArgs(deployer.address, B.address, 0);
        await expect(token1.functions['safeTransferFrom(address,address,uint256,bytes)'](deployer.address, C.address, 1, "0x00")).to.be.revertedWith("_to contract does not implement ERC721Received");
    });
});