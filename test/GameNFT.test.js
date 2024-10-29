const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameNFT", function () {
    let GameNFT;
    let gameNFT;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        GameNFT = await ethers.getContractFactory("GameNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy a new GameNFT contract for each test
        gameNFT = await GameNFT.deploy();
        await gameNFT.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await gameNFT.hasRole(await gameNFT.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
        });

        it("Should assign the minter role to the owner", async function () {
            expect(await gameNFT.hasRole(await gameNFT.MINTER_ROLE(), owner.address)).to.equal(true);
        });

        it("Should set the initial mint price", async function () {
            expect(await gameNFT.mintPrice()).to.equal(ethers.utils.parseEther("0.05"));
        });
    });

    describe("Minting", function () {
        it("Should allow minting with correct payment", async function () {
            const mintPrice = await gameNFT.mintPrice();
            await gameNFT.connect(addr1).mint(
                "ipfs://test-uri",
                { value: mintPrice }
            );

            expect(await gameNFT.ownerOf(0)).to.equal(addr1.address);
        });

        it("Should fail when minting with insufficient payment", async function () {
            const mintPrice = await gameNFT.mintPrice();
            await expect(
                gameNFT.connect(addr1).mint(
                    "ipfs://test-uri",
                    { value: mintPrice.sub(1) }
                )
            ).to.be.revertedWith("Insufficient payment");
        });

        it("Should initialize gaming attributes correctly", async function () {
            const mintPrice = await gameNFT.mintPrice();
            await gameNFT.connect(addr1).mint(
                "ipfs://test-uri",
                { value: mintPrice }
            );

            const attributes = await gameNFT.tokenAttributes(0);
            expect(attributes.level).to.equal(1);
            expect(attributes.experience).to.equal(0);
            expect(attributes.power).to.equal(100);
            expect(attributes.isInBattle).to.equal(false);
        });
    });

    describe("Game Mechanics", function () {
        beforeEach(async function () {
            // Mint NFTs for testing
            const mintPrice = await gameNFT.mintPrice();
            await gameNFT.connect(addr1).mint(
                "ipfs://test-uri-1",
                { value: mintPrice }
            );
            await gameNFT.connect(addr2).mint(
                "ipfs://test-uri-2",
                { value: mintPrice }
            );
        });

        it("Should allow level up by game manager", async function () {
            await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // 1 day
            await gameNFT.levelUp(0);

            const attributes = await gameNFT.tokenAttributes(0);
            expect(attributes.level).to.equal(2);
            expect(attributes.power).to.equal(150);
        });

        it("Should prevent level up during cooldown", async function () {
            await gameNFT.levelUp(0);
            await expect(
                gameNFT.levelUp(0)
            ).to.be.revertedWith("Level up cooldown");
        });

        it("Should handle battle mechanics correctly", async function () {
            await gameNFT.startBattle(0, 1);
            
            const token0 = await gameNFT.tokenAttributes(0);
            const token1 = await gameNFT.tokenAttributes(1);
            
            expect(token0.isInBattle).to.equal(true);
            expect(token1.isInBattle).to.equal(true);

            await gameNFT.endBattle(0, 1, 0);
            
            const updatedToken0 = await gameNFT.tokenAttributes(0);
            expect(updatedToken0.isInBattle).to.equal(false);
            expect(updatedToken0.experience).to.equal(100);
        });

        it("Should prevent transfer of NFTs in battle", async function () {
            await gameNFT.startBattle(0, 1);
            
            await expect(
                gameNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
            ).to.be.revertedWith("Token is in battle");
        });
    });

    describe("Admin Functions", function () {
        it("Should allow admin to update mint price", async function () {
            const newPrice = ethers.utils.parseEther("0.1");
            await gameNFT.setMintPrice(newPrice);
            expect(await gameNFT.mintPrice()).to.equal(newPrice);
        });

        it("Should allow admin to update max supply", async function () {
            const newMaxSupply = 20000;
            await gameNFT.setMaxSupply(newMaxSupply);
            expect(await gameNFT.maxSupply()).to.equal(newMaxSupply);
        });

        it("Should allow admin to withdraw funds", async function () {
            const mintPrice = await gameNFT.mintPrice();
            await gameNFT.connect(addr1).mint(
                "ipfs://test-uri",
                { value: mintPrice }
            );

            const initialBalance = await owner.getBalance();
            await gameNFT.withdraw();
            const finalBalance = await owner.getBalance();

            expect(finalBalance.sub(initialBalance)).to.be.closeTo(
                mintPrice,
                ethers.utils.parseEther("0.001") // Account for gas costs
            );
        });
    });

    describe("Pausable", function () {
        it("Should pause and unpause correctly", async function () {
            await gameNFT.pause();
            
            const mintPrice = await gameNFT.mintPrice();
            await expect(
                gameNFT.connect(addr1).mint(
                    "ipfs://test-uri",
                    { value: mintPrice }
                )
            ).to.be.reverted;

            await gameNFT.unpause();
            
            await gameNFT.connect(addr1).mint(
                "ipfs://test-uri",
                { value: mintPrice }
            );
            expect(await gameNFT.ownerOf(0)).to.equal(addr1.address);
        });
    });
});