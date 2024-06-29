// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initialFunding = hre.ethers.utils.parseEther('0.0025')
  const CardWave = await hre.ethers.getContractFactory("CardWave");
  const cardWave = await CardWave.deploy();
  await cardWave.deployed();
  console.log("Contract Deployed to: ", cardWave.address);
  console.log("Contract funded with:", initialFunding.toString(), "wei");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
