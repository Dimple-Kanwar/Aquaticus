// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping (address => uint256) mintedPerWallet;

    // Events
    event NFTMinted(address indexed owner, uint256 indexed tokenId);

    // Constructor defining token name and token Symbol
    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(){}

    // Mint an NFT
    function safeMint(address to, string memory uri)
    public 
    nonReentrant 
    onlyOwner
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(msg.sender, tokenId);
        
    }


    // Override functions

    // Returns the token metadata url of the requested tokenId
    function tokenURI(uint256 tokenId) 
    public
    view 
    virtual
    override(ERC721, ERC721URIStorage)
    returns(string memory){
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns(bool){
        return super.supportsInterface(interfaceId);
    }
}