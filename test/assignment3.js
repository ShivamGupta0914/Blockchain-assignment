const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
// const {type} = require(@NomicLabsHardhatPluginError);
describe("Token contract", function () {

    async function deployTokenFixture() {
        const bContract = await ethers.getContractFactory("B");
        const B = await bContract.deploy();
        await B.deployed();
        const aContract = await ethers.getContractFactory("A");
        const A = await aContract.deploy(B.address);
        await A.deployed();
        const [owner, user1, user2] = await ethers.getSigners();
        return { A, B, owner, user1, user2 };
    }

    it("should work properly", async () => {
        const { A, B, owner } = await loadFixture(deployTokenFixture);
        await A.addition(5);
        expect(await A.add()).to.equal(5);
        expect(await A.initTotal()).to.equal(5);
        const nonExistentFuncSignature = 'nonExistentFunc(uint256)';
        const fakeDemoContract = new ethers.Contract(
            A.address,
            [
                ...A.interface.fragments,
                `function ${nonExistentFuncSignature}`,
            ],
            owner,
        );
        const tx = await fakeDemoContract[nonExistentFuncSignature](7);
        expect(await A.initTotal()).to.equal(35);
    });

    it("addition function should work properly", async () => {
        const { A } = await loadFixture(deployTokenFixture);
        await A.addition(5);
        expect(await A.add()).to.equal(5);
        expect(await A.initTotal()).to.equal(5);
        expect(await A.addition(5)).to.emit(A, "AddEvent").withArgs(10, 5);
    });

    it("substraction should work properly", async () => {
        const { A } = await loadFixture(deployTokenFixture);
        await A.addition(4);
        expect(await A.add()).to.equal(4);
        expect(await A.initTotal()).to.equal(4);
        await A.subtract(2);
        expect(await A.initTotal()).to.equal(2);
        expect(await A.sub()).to.equal(2);
        expect(await A.subtract(1)).to.emit(A, "SubEvent").withArgs(1, 5);
    });

    it("multiply method of contract B should work properly", async () => {
        const { B } = await loadFixture(deployTokenFixture);
        await B.multiply(2);
        expect(await B.initTotal()).to.equal(0);
        expect(await B.multiply(2)).to.emit(B, "MultiplyEvent").withArgs(0, 0, 2);
    });
});