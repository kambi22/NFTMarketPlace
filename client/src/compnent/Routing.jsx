import React, { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Multisig from "./MultiSig";
import Footer from "./Footer";
import Header from "./Navbar";
import Login from "./Login";
import Home from "./Home";
import DetailMultiSig from "./BiddingMuliSig";
import Simple from "./SimpleStorage";
import Nftminting from "./Nftminting";
import NftView from "./NftView";
import AuctonDutch from "./AuctionDutch";
import AuctionEnglish from "./AuctionEnglish";
import BuyNft from "./BuyNft";
import EngAuctionBidding from "./EngAuctionBidding";
import DutchAuctonBidding from "./DutAuctionBidding";
import NftsHome from "./NftsHome";
import Practice from "./practice";
import PageNotFound from "./PageNotFound";

const Routting = (props) => {
  
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>

          <Route path="/oldhome" Component={Home} />
          <Route path="/" Component={NftsHome} />
          <Route path="/multisignature-wallet" Component={Multisig} />
          <Route path="/multisignature-wallet/mulisignature-details" Component={DetailMultiSig} />
          <Route path="/auction-dutch" Component={AuctonDutch} />
          <Route path="/auction-english" Component={AuctionEnglish} />
          <Route path="/auction-english/bidding" Component={EngAuctionBidding} />
          <Route path="/auction-dutch/bidding" Component={DutchAuctonBidding} />
          <Route path="/nftminting" Component={Nftminting} />
          <Route path="/nftbuy/:Id" Component={BuyNft} />
          <Route path="/nftselling" Component={NftView} />
          <Route path="/login" Component={Login} />
          <Route path="/simple" Component={Simple} />
          <Route path="/*" Component={PageNotFound} />
          <Route path="/practice" Component={Practice} />


        </Routes>
      <FooterComponent/>
      </BrowserRouter>
    </div>
  )
};

const FooterComponent = () => {
  let location  = useLocation();
    if (location.pathname == '/nftshome') {
      return;
    } else {
      return(
        <Footer/>
      )
    }
}

export default Routting;
