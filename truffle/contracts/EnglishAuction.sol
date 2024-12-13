// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERCC721 {
    function transferFrom(address from, address to, uint tokenId) external;
    function ownerOf(uint tokenId) external view returns (address);
    function isApprovedForAll(
        address owner,
        address operator
    ) external view returns (bool);
}

contract EnglishAuction {
    address public owner;
    address public highestBidder;
    uint256 public highestBid;
    IERCC721 public nftItem;
    bool public ended;
    uint256 public endTime;
    uint256 public tokenId;
    uint256 public startTime;
    event AuctionEnd(address HighestBidder, uint256 HighestBid);
    event startAuction(uint256 price, uint256 duration, uint256 tokenId);
    event previews(address PreviewsHighestBidder, uint256 PreviewsHighestBid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner Can Access");
        _;
    }
    modifier TimeNotEnded() {
        require(!ended, "Auction Is Ended");
        require(block.timestamp < endTime, "Bidding time is over");
        _;
    }

    receive() external payable {
        revert("Cannot send Ether directly to this contract");
    }

    function StartBidding(
        address _nftItem,
        uint256 _duration,
        uint256 _tokenId,
        uint256 _highestBid
    ) public {
        owner = msg.sender;
        nftItem = IERCC721(_nftItem);
        startTime = block.timestamp;
        endTime = startTime + _duration;
        tokenId = _tokenId;
        highestBid = _highestBid;

        require(
            nftItem.isApprovedForAll(owner, address(this)),
            "Auction contract is not approved to transfer this NFT"
        );

        require(
            nftItem.ownerOf(_tokenId) == owner,
            "Caller does not own token"
        );

        emit startAuction(highestBid, _duration, tokenId);
    }

    function Bid() public payable TimeNotEnded {
        require(msg.sender != owner, "Owner cannot bid");
        require(!ended, "Auction is over");
        require(msg.value > highestBid, "Bid is too low");

        address previousHighestBidder = highestBidder;
        uint previousHighestBid = highestBid;

        highestBidder = msg.sender;
        highestBid = msg.value;

        // Refund the previous highest bidder
        if (previousHighestBidder != address(0)) {
            (bool sent, ) = previousHighestBidder.call{
                value: previousHighestBid
            }("");
            require(sent, "Failed to refund previous highest bidder");
        }

        emit previews(previousHighestBidder, previousHighestBid);
    }

    function EndTime() public onlyOwner {
        ended = true;
        owner = highestBidder;

        // Transfer the funds first
        (bool sent, ) = payable(msg.sender).call{value: highestBid}("");
        require(sent, "Transfer failed to owner");

        // Then transfer the NFT
        nftItem.transferFrom(msg.sender, highestBidder, tokenId);
        reset();
        emit AuctionEnd(highestBidder, highestBid);
    }

    function Cancel() public onlyOwner TimeNotEnded {
        ended = true;

        if (highestBid != 0) {
            uint refundAmount = highestBid;
            address refundAddress = highestBidder;

            highestBid = 0;
            highestBidder = address(0);

            if (refundAmount > 0) {
                (bool sent, ) = refundAddress.call{value: refundAmount}("");
                require(sent, "Transfer failed to highest bidder");
            }
        }
    }

    function checkTime() public view returns (uint256 Time) {
        if (block.timestamp > endTime) {
            return 0;
        } else {
            return endTime - block.timestamp;
        }
    }

    function reset() public {
        owner = address(0);
        highestBidder = address(0);
        highestBid = 0 ether;
        ended = false;
        endTime = 0;
        tokenId = 0;
        startTime = 0;
    }
}
