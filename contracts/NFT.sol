// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract AquaticusNFTUpgradeable is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract.
     */
    function initialize(string memory name, string memory symbol)
        public
        initializer
    {
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init();
        __ERC721Enumerable_init();
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
    }

    // Override supportsInterface to include both ERC721URIStorage and ERC721Enumerable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Override _beforeTokenTransfer to include logic from both ERC721 and ERC721Enumerable
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // Override _burn to include logic from both ERC721 and ERC721URIStorage
    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    // Override tokenURI to include logic from both ERC721 and ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Mint a new NFT
    function mintNFT(address recipient, string memory uri)
        public
        onlyOwner
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require(bytes(uri).length > 0, "URI cannot be empty");
        require(recipient != address(0), "Recipient cannot be zero address");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);

        return newItemId;
    }

    // Burn an NFT
    function burnNFT(uint256 tokenId)
        public
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(_exists(tokenId), "Token does not exist.");
        _burn(tokenId);
    }

    // Pause the contract
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause the contract
    function unpause() public onlyOwner {
        _unpause();
    }
}