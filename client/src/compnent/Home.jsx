import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Fab, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router'
import Footer from "./Footer";
import { notifyconfirm, toast } from "./Notify";
const Home = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        {/* Min crate account page -----------------------------------------------------------------------*/}
        <Container className="d-sm-inline d-none ">
          <Row xl={2} lg={2} md={2}  >

            <Col className="d-inline">

              <div className="p-5 mt-5 align-items-center" >
                <h1 className=" text-info text-start mb-5 display-5 text-weight-bold"><strong>Multi-Signature Wallet</strong></h1>
                <div className="ms-5 text-secondary">
                <p className="textstyle">A multisig wallet, also known as a multisig vault or multisig safe, is a digital application for securely storing cryptocurrency assets like bitcoins. Multiple signatures (private keys) are required to access the bitcoin stored in the wallet and to perform any transactions on those bitcoins. If one of those signatures is missing, the transaction will not go through. A multisig wallet is like a bank's safe deposit box that requires multiple keys to be used at the same time to open it.</p>
                <p className="textstyle">By requiring two or more private keys, a multisig wallet adds additional security to the practice of crypto asset storage. It also secures the underlying funds represented by those assets.</p>
                </div>
                {/* <Fab className="w-50  mt-5"  variant="extended" color="white"><h5 className="mt-1">Create Account</h5></Fab> */}
                <IconButton onClick={() => navigate('multisignature-wallet')}>
                  <Player className="   " src="https://lottie.host/e09c9d5b-9bfa-4806-a2ae-76d5035a9e53/Aw4B3mPqMn.json" loop autoplay />

                </IconButton>

              </div>
            </Col>
            <Col className="d-inline">
              <Player className="mt-5 pt-5 w-100" style={{ height: '500px' }} src='https://lottie.host/4667f3f7-77b4-4daa-85af-6c7cb0361de3/kwHopEHwEq.json' loop autoplay />
            </Col>
          </Row>

        </Container>
        <Container className="d-sm-none d-inline">
          <Row sm={1} xs={1} >


            <Col>
              <Player className="   " src="https://lottie.host/4667f3f7-77b4-4daa-85af-6c7cb0361de3/kwHopEHwEq.json" loop autoplay />

            </Col>
            <Col>
              <div className="p-5 mt-5 bg-primaryk align-items-center" >
                <h1 className="text-info mb-5 display-5 text-start"><strong>Multi-Signature Wallet</strong></h1>
                <p className="textstyle text-secondary">A multisig wallet, also known as a multisig vault or multisig safe, is a digital application for securely storing cryptocurrency assets like bitcoins. Multiple signatures (private keys) are required to access the bitcoin stored in the wallet and to perform any transactions on those bitcoins. If one of those signatures is missing, the transaction will not go through. A multisig wallet is like a bank's safe deposit box that requires multiple keys to be used at the same time to open it.</p>
              
                <IconButton onClick={() => navigate('multisignature-wallet')}>
                  <Player className="   " src="https://lottie.host/e09c9d5b-9bfa-4806-a2ae-76d5035a9e53/Aw4B3mPqMn.json" loop autoplay />

                </IconButton>


              </div>
            </Col>
          </Row>
        </Container>

        {/* Home Load page *--------------------------------------------------------------------------------*/}
        <Container >
          <Row xl={2} lg={2} md={2} sm={1} xs={1} >
            <Col >
              <Player className="mt-5 pt-5 w-100" src='https://lottie.host/c8ea89bd-f982-4778-994f-adecbbb9e99c/GQUdoDc6E1.json' loop autoplay />
            </Col>
            <Col >
              <div className="p-5 mt-5  align-items-center" >
                <h1 className="text-secondary mb-5 display-5 text-weight-bold text-start"><strong>English Auction</strong></h1>
                <div className="text-secondary">
              <p className="textstyle">The English Auction, also known as the open ascending price auction, is one of the most popular auction formats. It’s widely used in both traditional and online auctions. In this type of auction, the auctioneer starts with a low initial price, and potential buyers compete by successively increasing their bids until no higher bids are offered. The auction continues until a final bid stands unchallenged for a predetermined period, and the item is sold to the highest bidder at that final price</p>
                <p className="textstyle">Bidding Process: Bidders submit their bids, and each new bid must be higher than the previous one. The auctioneer continuously updates the current highest bid and the bidder associated with it.</p>
                </div>
                <IconButton onClick={() => navigate('english-auction')}>
                  <Player className="   " src="https://lottie.host/e09c9d5b-9bfa-4806-a2ae-76d5035a9e53/Aw4B3mPqMn.json" loop autoplay />



                </IconButton>

              </div>
            </Col>

          </Row>

        </Container>
        {/*Life insurence page *--------------------------------------------------------------------------------*/}
        <Container className="mt-5">
          <Row xl={2} lg={2} md={2} sm={1} xs={1} >

            <Col >
              <div className="p-5 mt-5  align-items-center" >
                <h1 className="text-warning mb-5 display-5 text-weight-bold text-start"><strong>Dutch Auction</strong></h1>
                <div className=" text-secondary">
                 
                  <p className="textstyle">In a Dutch auction, the price with the highest number of bidders is selected as the offering price so that the entire amount offered is sold at a single price.
                  This price may not necessarily be the highest price.</p>
                  <p className="textstyle">f a company is using a Dutch auction for an initial public offering (IPO), potential investors enter their bids for the number of shares they want to purchase as well as the price they are willing to pay. For example, an investor may place a bid for 100 stock shares at $100 while another investor offers $95 for 500 shares.</p>
                </div>
                <IconButton onClick={() => navigate('dutch-auction')}>
                  <Player className="   " src="https://lottie.host/e09c9d5b-9bfa-4806-a2ae-76d5035a9e53/Aw4B3mPqMn.json" loop autoplay />

                </IconButton>

              </div>
            </Col>
            <Col >
              <Player className="mt-5 pt-5 w-100" src="https://lottie.host/820ee3ea-ad5b-4fa3-8cff-40229f6f1701/jvTWYzS9HP.json" loop autoplay />
            </Col>
          </Row>

        </Container>
        {/* Home Load page *--------------------------------------------------------------------------------*/}
        <Container >
          <Row xl={2} lg={2} md={2} sm={1} xs={1} >
            <Col >
              <Player className="mt-5 pt-5 w-100" src="https://lottie.host/e7ff36a5-4f42-41ca-b275-52ebb656734d/5LifMBcXdj.json" loop autoplay />
            </Col>
            <Col >
              <div className="p-5 mt-5  align-items-center" >
                <h1 className="text-primary mb-5 display-5 text-weight-bold text-start"><strong>Nfts Mint</strong></h1>
                <div className="text-secondary">
                  <p className="textstyle">Non-fungible tokens (NFTs) are assets like a piece of art, digital content, or video that have been tokenized via a blockchain. Tokens are unique identification codes created from metadata via an encryption function. These tokens are then stored on a blockchain, while the assets themselves are stored in other places. The connection between the token and the asset is what makes them unique.</p>
                  <p className="textstyle"  > NFTs can be traded and exchanged for money, cryptocurrencies, or other NFTs—it all depends on the value the market and owners have placed on them. For instance, you could draw a smiley face on a banana, </p>
                </div>
                <IconButton className="" style={{ left: '0px' }} onClick={() => navigate('nft-mint')}>
                  <Player className="" src="https://lottie.host/e09c9d5b-9bfa-4806-a2ae-76d5035a9e53/Aw4B3mPqMn.json" loop autoplay />
                </IconButton>

              </div>
            </Col>

          </Row>

        </Container>

      </div>
    </div>
  )
};

export default Home;
