import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AquaticusToken", (m) => {
  const token = m.contract("NFT", ["AquaToken", "AT"]);

  return { token };
});