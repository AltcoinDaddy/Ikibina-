// scripts/deploy.ts
import { ethers } from "hardhat";
import { TontineClub } from "../typechain-types";
import { verify } from "../utils/verify";

async function main() {
  try {
    // Get the ContractFactory
    const TontineClub = await ethers.getContractFactory("TontineClub");

    console.log("Deploying TontineClub...");
    const tontine = await TontineClub.deploy();
    await tontine.waitForDeployment();

    const tontineAddress = await tontine.getAddress();
    console.log("TontineClub deployed to:", tontineAddress);

    // Wait for few block confirmations
    console.log("Waiting for block confirmations...");
    const deploymentTransaction = tontine.deploymentTransaction();
    if (deploymentTransaction) {
      await deploymentTransaction.wait(6);
    }

    // Verify the contract
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("Verifying contract on Etherscan...");
      await verify(tontineAddress, []);
      console.log("Contract verified on Etherscan");
    }

  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});