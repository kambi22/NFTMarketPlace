// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERCC721 {
    function transferFrom(address from, address to, uint tokenId) external;
    function ownerOf(uint tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract DutchAuction {
    address public owner;
    address public buyer;
    IERCC721 public nftItem;
    uint public tokenId;
    uint public startTime;
    uint public endTime;
    uint public startPrice;
    uint public endPrice;
    bool public isActive;

    event BuyEvent(address indexed buyer, string message);
    event AuctionEnded(string message);
    event AuctionCancel(string message);
    event AuctionCreated(address indexed owner, uint startPrice, uint endPrice, uint startTime, uint endTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access this");
        _;
    }

    modifier auctionActive() {
        require(isActive, "Auction is not active");
        _;
    }

    function createAuction(uint _startPrice, uint _endPrice, uint _duration, address _nftItem, uint _tokenId) public {
        owner = msg.sender;
        startPrice = _startPrice ;
        endPrice = _endPrice;
        startTime = block.timestamp;
        endTime = startTime + _duration;
        nftItem = IERCC721(_nftItem);
        tokenId = _tokenId;

        // Ensure the auction contract is approved to transfer the NFT
        require(nftItem.isApprovedForAll(owner, address(this)), "Auction contract is not approved to transfer this NFT");

        // Ensure the caller owns the NFT
        require(nftItem.ownerOf(tokenId) == owner, "Caller does not own the NFT");

        isActive = true;
        emit AuctionCreated(owner, startPrice, endPrice, startTime, endTime);
    }


        function buy() external payable auctionActive {
        
        isActive = false;
        buyer = msg.sender;
        address oldOwner = owner;
        owner = msg.sender;
        
        // Transfer NFT to the buyer
        nftItem.transferFrom(oldOwner, msg.sender, tokenId);

        // Transfer funds to the owner
        (bool success, ) = payable(oldOwner).call{value: msg.value}("");
        require(success, "Transfer to owner failed");


        emit BuyEvent(buyer, "Item successfully purchased");
    }

    function endAuction() public onlyOwner auctionActive {
        isActive = false;

        // If the NFT wasn't sold, return it to the owner
        if (buyer == address(0)) {
            nftItem.transferFrom(owner, owner, tokenId);
        }
        resetAuction();
        emit AuctionEnded("Auction ended by owner");
    }

    function Cancel() public onlyOwner() auctionActive() {
        isActive = false;

         if (buyer == address(0)) {
            nftItem.transferFrom(owner, owner, tokenId);
        }
        resetAuction();

        emit AuctionCancel("Auction cancelled by owner");
    }

   
    function resetAuction() public  {
        
            startPrice = 0;
            endPrice = 0;
            startTime = 0;
            endTime = 0;
            tokenId = 0;
            isActive = false;
            owner = address(0);
            buyer = address(0);
            
       
    }
}
