const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT Contract", function () {
  let MyNFT, nftContract, owner, recipient, otherAccount;

  beforeEach(async function () {
    // Deploy contract
    MyNFT = await ethers.getContractFactory("MyNFT");
    [owner, recipient, otherAccount] = await ethers.getSigners();
    
    nftContract = await MyNFT.deploy("Test NFT", "TNFT");
    await nftContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await nftContract.name()).to.equal("Test NFT");
      expect(await nftContract.symbol()).to.equal("TNFT");
    });
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();

      // Check token minting
      const tokenId = receipt.logs[0].args[2];
      expect(await nftContract.ownerOf(tokenId)).to.equal(recipient.address);
      expect(await nftContract.tokenURI(tokenId)).to.equal(tokenURI);
    });

    it("Should prevent non-owner from minting", async function () {
      const tokenURI = "https://example.com/token/1";
      await expect(
        nftContract.connect(otherAccount).mintNFT(recipient.address, tokenURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should increment token ID with each mint", async function () {
      const tokenURI1 = "https://example.com/token/1";
      const tokenURI2 = "https://example.com/token/2";
      
      const tx1 = await nftContract.mintNFT(recipient.address, tokenURI1);
      const receipt1 = await tx1.wait();
      const tokenId1 = receipt1.logs[0].args[2];
      const tx2 = await nftContract.mintNFT(recipient.address, tokenURI2);
      const receipt2 = await tx2.wait();
      const tokenId2 = receipt2.logs[0].args[2];
      expect(tokenId2).to.equal(Number(tokenId1) + 1);
    });
  });

  describe("Token URI", function () {
    it("Should set and retrieve token URI correctly", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args[2];

      expect(await nftContract.tokenURI(tokenId)).to.equal(tokenURI);
    });
  });
});