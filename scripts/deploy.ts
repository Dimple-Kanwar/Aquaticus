import { ethers, upgrades } from "hardhat";

async function main() {
  // Get the signer (account) that will deploy the contracts
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the implementation contract
  console.log("Deploying AquaticusNFTUpgradeable...");
  const AquaticusNFTUpgradeable = await ethers.getContractFactory("AquaticusNFTUpgradeable");

  // Deploy the proxy contract
  const proxy = await upgrades.deployProxy(AquaticusNFTUpgradeable, ["AquaNFT", "AT"], {
    initializer: "initialize",
  });

  await proxy.waitForDeployment(); // Use waitForDeployment() instead of deployed() for Hardhat 2.22.16+
  console.log("AquaticusNFTUpgradeable proxy deployed to:", await proxy.getAddress());

  // Retrieve the implementation contract address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());
  console.log("Implementation contract address:", implementationAddress);

  // Retrieve the proxy admin address
  const adminAddress = await upgrades.erc1967.getAdminAddress(await proxy.getAddress());
  console.log("Proxy admin address:", adminAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });