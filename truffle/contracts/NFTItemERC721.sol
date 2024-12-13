// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 public _tokenId;
    uint256[] public _mintedTokens; // Track all minted token IDs

    event Minted(uint256 tokenId);

    struct History {
        // set History type structure
        address from;
        address to;
        uint256 tokenIds;
    }

    mapping(uint256 => History[]) public ownershipHistory;
    // Mapping to store price of each NFT
    mapping(address => uint256[]) public tokenIds;
    mapping(uint256 => uint256) public price;

    event remover(uint256[] array, string message, uint256 tokenId);

    // Constructor to set the token name and symbol
    constructor() ERC721("Softwork", "S") Ownable(_msgSender()) {
        // Initialize owner in Ownable
        transferOwnership(msg.sender);
    }

    function _checkOwner() internal view override {
        require(owner() == _msgSender(), "Caller is not the owner");
    }

    // Mint an NFT
    function mintNft(
        //mint function for nft token mint
        address recipient,
        string memory _tokenURI
    ) public returns (uint256) {
        _tokenId += 1;
        uint256 newTokenId = _tokenId;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        _mintedTokens.push(_tokenId); // Store minted token ID
        tokenIds[recipient].push(_tokenId);

        emit Minted(newTokenId);
        return newTokenId;
    }

    // List NFT for sale
    function sellNft(uint256 _tokenid, uint256 _price) public {
        // sell Nft token sell function
        require(
            ownerOf(_tokenid) == _msgSender(),
            "Caller is not the owner of this NFT"
        );
        price[_tokenid] = _price;
        approve(address(this), _tokenid); // Seller approves the contract to transfer their NFT
    }

    
    function buyNft(uint256 tokenId) public payable {
        address seller = ownerOf(tokenId);
        uint PriceValue = price[tokenId];

        uint256[] storage array = tokenIds[seller]; // remove token id from user token ids block start 
        uint256 index;

        for (uint256 i = 0; i < array.length; i++) { // start loop util array length
            if (array[i] == tokenId) {      // check array value equal tokenId 
                index = i; // store in index variable
                break; // stop execution when index receive; 
            }
        }

        array[index] = array[array.length - 1];  //array[index ]= id, array.len -1 return array last element index ex: last e is 6, 6-1 =5 index of six
        array.pop();        // remove array's last element             // remove token id block end 

        require(PriceValue > 0, "Token not listed for sale");
        require(
            seller != _msgSender(),
            "You are already the owner of this token"
        );
        require(msg.value >= PriceValue, "Insufficient funds to buy NFT");

        // Transfer the NFT from seller to buyer
        _transfer(seller, msg.sender, tokenId);// transfer nft 

        // Clear the price after purchase
        price[tokenId] = 0; //set price 0 after bought

        History memory values = History({// create history , create history compy using memory and then store in state var
            from: seller,
            to: msg.sender,
            tokenIds: tokenId
        });

        // Push the history entry into the ownershipHistory array for the specific tokenId

        tokenIds[msg.sender].push(tokenId);
        ownershipHistory[tokenId].push(values);// pass history memory reference  and set srore history

        // Send funds to the seller
        (bool sent, ) = payable(seller).call{value: PriceValue}("");    // pay to seller
        require(sent, "Funds transfer to seller failed");

        // Refund excess funds to the buyer
        uint refund = msg.value - PriceValue;
        if (refund > 0) {
            (bool refundSent, ) = payable(msg.sender).call{value: refund}("");// refund to buyer
            require(refundSent, "Refund to buyer failed");
        }
        emit remover(array, "this is emitted from remover", tokenId);
    }

    function getAllMintedTokens() public view returns (uint256[] memory) { //get all minted tokens from this function
       
        return _mintedTokens; // Return all minted tokens
    }

    function getAddressTokenIds(
        address account
    ) public view returns (uint256[] memory) {
        // get token ids using address
        return tokenIds[account];
    }

    function getOwnershipHistory(
        uint256 tokenId
    ) public view returns (History[] memory) {
        // get token Id selling history function
        return ownershipHistory[tokenId];
    }

    // Transfer NFT (non-sale)
    function transferNFT(address to, uint256 tokenId) public {
        // for transfer nft token ,transfer function
        require(
            ownerOf(tokenId) == _msgSender(),
            "Caller is not the owner of this NFT"
        );
        History memory values = History({
            from: msg.sender,
            to: to,
            tokenIds: tokenId
        });

        // Push the history entry into the ownershipHistory array for the specific tokenId
        ownershipHistory[tokenId].push(values);

        _transfer(_msgSender(), to, tokenId);
    }

    // Check if an operator is approved for all
    //------------------------------------------ Un-useable function -----------------------------------------------
    function checkIsAppForAll(
        address _owner,
        address operator
    ) public view returns (bool) {
        return isApprovedForAll(_owner, operator);
    }

    function isApproval(
        address contAddr,
        address tokenId
    ) public view returns (bool) {
        return isApproval(contAddr, tokenId);
    }

    // Burn an NFT
    function burnNft(uint256 tokenId) public onlyOwner {
        // burn function for destory nft
        _burn(tokenId);
    }
}
