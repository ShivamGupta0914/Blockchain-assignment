const {ethers, upgrades} = require("hardhat");

async function main() {
  const aContract = await ethers.getContractFactory("A");
  console.log("First contract is deploying......");
  const A = await upgrades.deployProxy(aContract, [2], {
    initializer : "setValue",
  });

  await A.deployed();

  console.log("First contract is deployed on address", A.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
