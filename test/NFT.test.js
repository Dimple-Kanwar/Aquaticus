import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT", function () {
    let MyNFT, myNFT, owner, addr1, addr2;
    const MINT_PRICE = ethers.parseEther("0.05");
    
    beforeEach(async function () {
        MyNFT = await ethers.getContractFactory("MyNFT");
        [owner, addr1, addr2] = await ethers.getSigners();
        myNFT = await MyNFT.deploy();
    });
    
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await myNFT.owner()).to.equal(owner.address);
        });
        
        it("Should start with sales disabled", async function () {
            expect(await myNFT.saleLive()).to.equal(false);
        });
    });
    
    describe("Minting", function () {
        beforeEach(async function () {
            await myNFT.setSaleState(true);
        });
        
        it("Should mint new token", async function () {
            const tokenURI = "ipfs://QmTest";
            await myNFT.connect(addr1).mint(tokenURI, { value: MINT_PRICE });
            
            expect(await myNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await myNFT.tokenURI(1)).to.equal(tokenURI);
        });
        
        it("Should fail if payment is insufficient", async function () {
            await expect(
                myNFT.connect(addr1).mint("ipfs://QmTest", {
                    value: ethers.parseEther("0.01")
                })
            ).to.be.revertedWith("Insufficient payment");
        });
        
        it("Should fail if sale is not live", async function () {
            await myNFT.setSaleState(false);
            await expect(
                myNFT.connect(addr1).mint("ipfs://QmTest", { value: MINT_PRICE })
            ).to.be.revertedWith("Sale must be active");
        });
    });
});

