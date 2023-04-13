const {ethers, upgrades} = require("hardhat");


const PROXY = "0x27481F538C36eb366FAB4752a8dd5a03ed04a3cF";
async function main() {
  const bContract = await ethers.getContractFactory("B");
  console.log("Second contract is deploying......");
  await upgrades.upgradeProxy(PROXY, bContract);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
