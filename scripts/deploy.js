const hre = require("hardhat");
// Used this script to deploy Shiva Token on sepolia testnet
async function main() {
  const Token = await ethers.getContractFactory("TokenImplement");
  console.log("deploying");
  const hardhatToken = await Token.deploy("Shiva Token", "SHIVA");
  await hardhatToken.deployed();
  console.log("deployed at address", hardhatToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
