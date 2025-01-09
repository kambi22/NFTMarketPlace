import React, { useContext, useEffect, useState } from "react"
import { Col, Container, Row, Navbar, Carousel, Button } from "react-bootstrap";
import { themeContext } from "../Context/themeContext";
import { IoMdCart } from "react-icons/io";
// import { Facebook, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { IconButton, Skeleton, Typography } from '@mui/material';
import Aos from 'aos'
import 'aos/dist/aos.css';
import { BlockchainContext } from "../Web3Connection/Connection";
import { useNavigate, useParams } from "react-router";
import { Player } from "@lottiefiles/react-lottie-player";
import { ContractMissingDeployDataError } from "web3";
import LoadingCard from "./Skeleton";

const NftsHome = (props) => {
    const { web, nftContract, nftContAddress, account } = useContext(BlockchainContext)
    const { isDark, toggleTheme } = useContext(themeContext);
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState(0);
    const [alltokenIds, setAlltokenIds] = useState([]);
    const [nftPrice, setNftPrice] = useState([]);
    const [nfts, setNfts] = useState([]);
    const [animation, setAnimation] = useState([]);
    const [threeD, setThreeD] = useState([]);
    const [art, setArt] = useState([]);
    const [carouselA, setCarouselA] = useState([]);
    const [carouselB, setCarouselB] = useState([]);
    const [ItemIdA, setItemIdA] = useState([]);
    const [ItemIdB, setItemIdB] = useState([]);
    const [ItemIdC, setItemIdC] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        Aos.init({
            duration: 2000
        })
    }, []);

    const GetAllTokenIds = async () => {//fitch all minted tokens nfts
        const allTokenIds = await nftContract.methods.getAllMintedTokens().call();
        const tokensPromises = allTokenIds.map((tokenId => Number(tokenId)));
        const TokenIds = await Promise.all(tokensPromises);
        setAlltokenIds(TokenIds);
        console.log("New token ids:", TokenIds);
        const nft = await nftContract.methods.tokenURI(1).call()//set 1 id as a defualt selected nft item
        console.log('nfts is:', nft);
        const tokenUriPromises = TokenIds.map((tokenId) => nftContract.methods.tokenURI(tokenId).call()) //resolve token ids promises
        const TokenUris = await Promise.all(tokenUriPromises);
        console.log('tokenUris:', TokenUris);
        const fetchNftPromises = TokenUris.map((uri) => fetch(uri).then(resp => resp.json()))//fetch token uris from ids
        const allNfts = await Promise.all(fetchNftPromises);
        setNfts(allNfts)
        let A = allNfts.slice(0, 4)
        let B = allNfts.slice(4, 8)
        setCarouselA(A)
        setCarouselB(B)

        console.log('carousel A', carouselA)
        console.log('carousel b', carouselB)

        let animationArray = [];
        let threeDArray = [];
        let artArray = [];
        let indexItemA = []
        let indexItemB = []
        let indexItemC = []

        const CollectionType = allNfts.map(data => data.type);
        const type = await Promise.all(CollectionType);
        console.log('types are :', type)
        type.map((data, i) => {
            if (data === 'Animation Collection') {
                animationArray.push(allNfts[i])
                indexItemA.push(i + 1)
            } else if (data === '3D Collection') {
                threeDArray.push(allNfts[i])
                indexItemB.push(i + 1)

            } else {
                artArray.push(allNfts[i])
                indexItemC.push(i + 1)

            }
        })
        setItemIdA(indexItemA)
        setItemIdB(indexItemB)
        setItemIdC(indexItemC)
        setAnimation(MakeObject(animationArray))
        setThreeD(MakeObject(threeDArray))
        setArt(MakeObject(artArray))
        const PricePromises = TokenIds.map(tokenId => nftContract.methods.price(tokenId).call())
        const BigIntPrice = await Promise.all(PricePromises);
        const intPromises = BigIntPrice.map(BigInt => Number(web.utils.fromWei(BigInt, 'ether')))
        const prices = await Promise.all(intPromises)
        console.log('prices are', prices)
        setNftPrice(prices)

    }
    useEffect(() => {
        if (!nftContract || !web) {
            console.log("Waiting for wallet or contract initialization...");
            return;
        }
        GetAllTokenIds();
    }, [nftContract, web]);
    

    const MakeObject = (collection) => {
        return collection.map((data) => {
            return {
                name: data.name,
                type: data.type,
                image: data.image
            };
        });
    }

    //------------------------------------------ function part -------------------------------------------

    const navigateToBuy = async (tokenId) => {
        navigate(`/nftbuy/${tokenId}`)
    }

    return (
        <div className="mb-5">

            <Container className={isDark ? 'nftHomeContainerDark pt-3' : "nftHomeContainerLight pt-3"} fluid>
                <Carousel className="bg-infok mb-5">
                    <Carousel.Item className=" bg-successk" >
                        <div className="d-flex  text-center  bg-primaryk " style={{ height: '350px' }}>
                            {carouselA.length > 0 ? carouselA.map((item, i) => (
                                <div className="ms-2 me-2 Carousel" style={{ maxWidth: '350px', minWidth: '350px' }} >
                                    <img className=" rounded-4 ms-2 me-2 h-100 w-100" src={item.image} alt="" />
                                </div>
                            )) : (
                                < >
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                </>
                            )}

                        </div>
                    </Carousel.Item>
                    <Carousel.Item className=" bg-successk" >
                        <div className="d-flex  text-center  bg-primaryk " style={{ height: '350px' }}>
                            {carouselB.length > 0 ? carouselB.map((item, i) => (
                                <div className="ms-2 me-2 Carousel" style={{ maxWidth: '350px', minWidth: '350px' }} >
                                    <img className=" rounded-4 ms-2 me-2 h-100 w-100" src={item.image} alt="" />
                                </div>
                            )) : (
                                < >
                                
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                    <Skeleton className=" rounded-4  me-2 h-100  w-100" animation='wave' />
                                </>
                            )}
                        </div>
                    </Carousel.Item>
                </Carousel>
            </Container>

            <h3 className="ms-5 mt-5 text-start fw-bold">Animations Collections</h3>
            <Container className="">
                <Row className=" mt-2   " xxl={4} xl={4} md={3} sm={2} xs={1}>
                    {animation.length > 0 ? (animation.map((item, k) => (
                        <Col className="mt-3  zooEffectContainer" key={k}>
                            <div className="w-100 zoomEffect shadow rounded-5 GlassEffect ImageEffect " onClick={() => navigateToBuy(ItemIdA[k])} style={{ height: '330px' }}>
                                <div className="" style={{ height: '200px' }} >
                                    <img className="pt-2 pe-2 ps-2 rounded-5 w-100 h-100" src={item.image} alt="" />
                                </div>
                                <div className="" >
                                    <div className="mt-3  d-flex me-3 ms-3">
                                        <h6>{item.name}</h6><br />

                                        <h6 className="text-end ms-auto">#: {ItemIdA[k]}</h6>
                                    </div>
                                    <h5 className="text-start ms-3">{nftPrice[ItemIdA[k] - 1]} ETH</h5>
                                    <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 ETH</p>
                                    <div className="BuyButton  pt-2 rounded-bottom-5 w-100" style={{ marginTop: "18px" }}>
                                        <div className=" w-100  d-flex  text-white p-1">
                                            <h6 className=" mx-auto" >Buy</h6>
                                            <i className="mx-end pe-3"><IoMdCart /></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))) : (
                        <>
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                        </>
                    )}
                </Row>
            </Container>
            <h3 className="ms-5 mt-5 text-start fw-bold">3D Collections</h3>
            <Container className="">
                <Row className=" mt-2   " xxl={4} xl={4} md={3} sm={2} xs={1}>
                    {threeD.length > 0 ? threeD.map((item, k) => (
                        <Col className="mt-3  zooEffectContainer" key={k}>
                            <div className="w-100 zoomEffect shadow rounded-5 GlassEffect ImageEffect " onClick={() => navigateToBuy(ItemIdB[k])} style={{ height: '330px' }}>
                                <div className="" style={{ height: '200px' }} >
                                    <img className="pt-2 pe-2 ps-2 rounded-5 w-100 h-100" src={item.image} alt="" />
                                </div>
                                <div className="" >
                                    <div className="mt-3  d-flex me-3 ms-3">
                                        <h6>{item.name}</h6><br />

                                        <h6 className="text-end ms-auto">#: {ItemIdB[k]}</h6>
                                    </div>
                                    <h5 className="text-start ms-3">{nftPrice[ItemIdB[k] - 1]} ETH</h5>
                                    <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 ETH</p>
                                    <div className="BuyButton  pt-2 rounded-bottom-5 w-100" style={{ marginTop: "18px" }}>
                                        <div className=" w-100  d-flex  text-white p-1">
                                            <h6 className=" mx-auto" >Buy</h6>
                                            <i className="mx-end pe-3"><IoMdCart /></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    )) : (
                        <>
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                        </>
                    )}
                </Row>
            </Container>
            <h3 className="ms-5 mt-5 text-start fw-bold">Art Collections</h3>
            <Container className="">
                <Row className=" mt-2   " xxl={4} xl={4} md={3} sm={2} xs={1}>
                    {art.length > 0 ? art.map((item, k) => (
                        <Col className="mt-3  zooEffectContainer" key={k}>
                            <div className="w-100 zoomEffect shadow rounded-5 GlassEffect ImageEffect " onClick={() => navigateToBuy(ItemIdC[k])} style={{ height: '330px' }}>
                                <div className="" style={{ height: '200px' }} >
                                    <img className="pt-2 pe-2 ps-2 rounded-5 w-100 h-100" src={item.image} alt="" />
                                </div>
                                <div className="" >
                                    <div className="mt-3  d-flex me-3 ms-3">
                                        <h6>{item.name}</h6><br />

                                        <h6 className="text-end ms-auto">#: {ItemIdC[k]}</h6>
                                    </div>
                                    <h5 className="text-start ms-3">{nftPrice[ItemIdC[k] - 1]} ETH</h5>
                                    <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 ETH</p>
                                    <div className="BuyButton  pt-2 rounded-bottom-5 w-100" style={{ marginTop: "18px" }}>
                                        <div className=" w-100  d-flex  text-white p-1">
                                            <h6 className=" mx-auto" >Buy</h6>
                                            <i className="mx-end pe-3"><IoMdCart /></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )) : (
                        <>
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                        </>
                    )}
                </Row>
            </Container>



            <h3 className="ms-5 mt-5 text-start fw-bold">All Collections</h3>
            <Container className="">
                <Row className=" mt-2   " xxl={4} xl={4} md={3} sm={2} xs={1}>
                    {nfts.length > 0 ? nfts.map((item, k) => (
                        <Col className="mt-3  zooEffectContainer" key={k}>
                            <div className="w-100 zoomEffect shadow rounded-5 GlassEffect ImageEffect " onClick={() => navigateToBuy(alltokenIds[k])} style={{ height: '330px' }}>
                                <div className="" style={{ height: '200px' }} >
                                    <img className="pt-2 pe-2 ps-2 rounded-5 w-100 h-100" src={item.image} alt="" />
                                </div>
                                <div className="" >
                                    <div className="mt-3  d-flex me-3 ms-3">
                                        <h6>{item.name}</h6><br />

                                        <h6 className="text-end ms-auto">#: {alltokenIds[k]}</h6>
                                    </div>
                                    <h5 className="text-start ms-3">{nftPrice[k]} ETH</h5>
                                    <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 ETH</p>
                                    <div className="BuyButton  pt-2 rounded-bottom-5 w-100" style={{ marginTop: "18px" }}>
                                        <div className=" w-100  d-flex  text-white p-1">
                                            <h6 className=" mx-auto" >Buy</h6>
                                            <i className="mx-end pe-3"><IoMdCart /></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>


                    )) : (
                        <>
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                            <LoadingCard />
                        </>
                    )}
                </Row>
            </Container>
            <Container className="w-100 h-100 mt-5 d-none" >
                <div className="GlassEffectFordiv w-100 h-100 shadow mt-3  rounded-5 " data-aos='fade-left'>
                    <Row className="bg-successk">
                        <Col className=" bg-primaryk w-100">
                            <div className="text-whitek bg-warningk shadow h-100 rounded-5 m-3" data-aos='fade-left'>
                                <Typography variant="h3">Hello from typo</Typography>
                                <h1>SEll Nft </h1>
                                <h1>Through Auctions</h1>
                                <h1>English Auction </h1>
                                <h1>Dutch Auction </h1>

                            </div>
                        </Col>
                        <Col className=" bg-primaryk h-100 w-100">
                            <div className="text-whitek bg-warningk shadow h-100 rounded-5 m-3" data-aos='fade-left'>
                                <Typography variant="h3">Hello from typo</Typography>
                                <h1>SEll Nft </h1>
                                <h1>Through Auctions</h1>
                                <h1>English Auction </h1>
                                <h1>Dutch Auction </h1>
                            </div>
                        </Col>
                    </Row>

                </div>
            </Container>



        </div>




    )
};

export default NftsHome;
