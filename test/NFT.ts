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
      const tokenId = receipt.logs[0].args.tokenId;
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
      const tokenId1 = receipt1.logs[0].args.tokenId;

      const tx2 = await nftContract.mintNFT(recipient.address, tokenURI2);
      const receipt2 = await tx2.wait();
      const tokenId2 = receipt2.logs[0].args.tokenId;

      expect(tokenId2).to.equal(tokenId1 + BigInt(1));
    });
  });

  describe("Burning", function () {
    it("Should burn an NFT successfully", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId;

      // Burn the NFT
      await nftContract.burnNFT(tokenId);

      // Verify the token no longer exists
      await expect(nftContract.ownerOf(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should prevent burning if not the owner", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId;

      // Attempt to burn by a non-owner
      await expect(
        nftContract.connect(otherAccount).burnNFT(tokenId)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transferring", function () {
    it("Should transfer NFT ownership successfully", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId;

      // Transfer NFT from recipient to otherAccount
      await nftContract
        .connect(recipient)
        .transferFrom(recipient.address, otherAccount.address, tokenId);

      // Verify new owner
      expect(await nftContract.ownerOf(tokenId)).to.equal(otherAccount.address);
    });

    it("Should prevent transferring NFT if not the owner or approved", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId;

      // Attempt to transfer by a non-owner
      await expect(
        nftContract
          .connect(otherAccount)
          .transferFrom(recipient.address, otherAccount.address, tokenId)
      ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });
  });

  describe("Viewing", function () {
    it("Should view all tokens owned by an address", async function () {
      const tokenURI1 = "https://example.com/token/1";
      const tokenURI2 = "https://example.com/token/2";

      // Mint two tokens to the recipient
      const tx1 = await nftContract.mintNFT(recipient.address, tokenURI1);
      const receipt1 = await tx1.wait();
      const tokenId1 = receipt1.logs[0].args.tokenId;

      const tx2 = await nftContract.mintNFT(recipient.address, tokenURI2);
      const receipt2 = await tx2.wait();
      const tokenId2 = receipt2.logs[0].args.tokenId;

      // Retrieve all tokens owned by recipient
      const balance = await nftContract.balanceOf(recipient.address);
      const tokens: string[] = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(recipient.address, i);
        tokens.push(tokenId.toString());
      }
      console.log({tokens});
      // Verify tokens
      expect(tokens).to.deep.equal([tokenId1.toString(), tokenId2.toString()]);
    });

    it("Should retrieve token URI correctly", async function () {
      const tokenURI = "https://example.com/token/1";
      const tx = await nftContract.mintNFT(recipient.address, tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.logs[0].args.tokenId;

      // Verify token URI
      expect(await nftContract.tokenURI(tokenId)).to.equal(tokenURI);
    });
  });
});