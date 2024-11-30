import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AquaticusToken", (m) => {
  const NFTContract = m.contract("MyNFT", ["AquaToken", "AT"]);

  return { NFTContract };
});