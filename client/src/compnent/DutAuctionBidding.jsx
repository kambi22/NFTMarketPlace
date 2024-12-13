import React, { useContext, useEffect, useState } from "react"
import { CardHeader, Col, Container, Row } from "react-bootstrap";
import gold from './images/bols.jpeg'
import { Button, Card, CardActionArea, CardContent, div, TextField } from "@mui/material";
import { MdAutoGraph, MdFavorite, MdFavoriteBorder, MdShower } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaArtstation, FaEthereum, FaRegClock, FaRegEye, FaTools } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BlockchainContext } from "../Web3Connection/Connection";
import { IoMdCart } from "react-icons/io";
import { notify, toast } from "./Notify";
import { Player } from "@lottiefiles/react-lottie-player";
import monky from './images/monkynft.jpg'
import { timeline } from "animejs";
const DutchAuctonBidding = (props) => {
    const { web, nftContract, dutchContract, dutchAddress, nftContAddress, account } = useContext(BlockchainContext)

    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState();
    const [ownerOf, setOwnerOf] = useState();
    const [currentPrice, setCurrentPrice] = useState();
    const [onlyOwner, setOnlyOwner] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [price, setPrice] = useState();
    const [nftMetadata, setNftMetadata] = useState({
        image: "https://img.freepik.com/free-psd/nft-cryptocurrency-3d-illustration_1419-2742.jpg?t=st=1730800651~exp=1730804251~hmac=a56fbd83d0b34c8ea65bc0c648a2316641573d07d2cf2ed247c07d7ab5a6dfd0&w=740",
        name: '',
        description: ''
    });


    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

 

   
    
        const getCurrentPricefun = async () => {
            try {
                const startPrice = Number(await dutchContract.methods.startPrice().call());
                const endPrice = Number(await dutchContract.methods.endPrice().call());
                const startTime = Number(await dutchContract.methods.startTime().call());
                const endTime = Number(await dutchContract.methods.endTime().call());
                const currentTime = Number(Math.floor(Date.now() / 1000)); // Current timestamp in seconds
    
                if (currentTime >= endTime) {
                    console.log('now price is: ', Number(web.utils.fromWei(endPrice.toString(), 'ether')));
                    setCurrentPrice(Number(web.utils.fromWei(endPrice.toString(), 'ether')));
                    setTimeLeft(0);
                    return;
                }
    
                const elapsedTime = currentTime - startTime;
                const totalDuration = endTime - startTime;
                const priceDecrease = startPrice - endPrice;
    
                console.log('elapsed time:', elapsedTime.toString());
                setTimeLeft((totalDuration - elapsedTime).toString());
    
                const currentPrice = startPrice - (priceDecrease * elapsedTime / totalDuration);
                setCurrentPrice(Number(web.utils.fromWei(currentPrice.toString(), 'ether')));
                setPrice(Number(web.utils.fromWei(endPrice.toString(), 'ether')));
    
                console.log('current price is:', currentPrice.toString());
            } catch (error) {
                console.log('error from get current price function', error);
            }
        };
    
        useEffect(() => {
            const intervalId = setInterval(getCurrentPricefun, 5000);
            return () => clearInterval(intervalId);
        }, []);
    

    const getNftData = async () => {
        try {
            const tokenId = await dutchContract.methods.tokenId().call();
           
            const owner = await dutchContract.methods.owner().call();

            setTokenId(Number(tokenId))
           

            const ownerof = await nftContract.methods.ownerOf(tokenId).call();
            setOwnerOf(ownerof)

            const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
            fetch(tokenURI)
                .then(response => response.json())
                .then(data => {
                    setNftMetadata({
                        image: data.image,
                        name: data.name,
                        description: data.description
                    })
                });

            console.log("nft ids:", tokenURI)

        } catch (error) {
            console.log("error to fetch nft data")
        }
    }
    useEffect(() => {
        getNftData()
    }, [dutchContract]);
    // const getAllTokens = async () => {
    //     try {

    //         const balance = await nftContract.methods.balanceOf(account).call();
    //         const tokens = Number(balance);

    //         getNftData(tokens);
    //         let tokenIds = [];
    //         for (let i = 0; i < tokens; i++) {
    //             tokenIds.push(i + 1);
    //         }


    //         const tokenURIPromises = tokenIds.map(tokenId => nftContract.methods.tokenURI(tokenId).call());
    //         const tokenURIs = await Promise.all(tokenURIPromises);
    //         setNftsUris(tokenURIs);

    //         const pricePromises = tokenIds.map(tokenId => nftContract.methods.price(tokenId).call());
    //         const pricesValues = await Promise.all(pricePromises);

    //         const bigNumberPromises = pricesValues.map(bigNumbers => Number(web.utils.fromWei(bigNumbers, 'ether')))
    //         const bigvalues = await Promise.all(bigNumberPromises);

    //         setNftPrice(bigvalues)

    //         const metadataPromises = tokenURIs.map(uri => fetch(uri).then(response => response.json()));

    //         const allNftsMetadata = await Promise.all(metadataPromises);

    //         const formattedMetadata = allNftsMetadata.map(data => ({
    //             image: data.image,
    //             name: data.name,
    //             description: data.description,

    //         }));
    //         setNfts(formattedMetadata)
    //         console.log('formatedmedata with price values:',formattedMetadata)

    //     } catch (error) {
    //         console.error("Error fetching all tokens:", error);
    //     }
    // };
    // useEffect(() => {
    //     getAllTokens()
    //     getNftData
    // }, [nftContract,account]);


    //-------------------------------------------------------------------------------------------------------------------------------------


    const Buying = async () => {
        try {
            setLoading(true)
            const gas = await dutchContract.methods.buy().estimateGas({ from: account, value: web.utils.toWei(currentPrice , 'ether') });
            const result = await dutchContract.methods.buy().send({ from: account, gas: gas, value: web.utils.toWei(currentPrice , 'ether') });
            console.log("sellt nft token", result)
            notify('success','Successful', `Successfully bought with ${currentPrice} ETH`)
            getNftData()
            setCurrentPrice(0)
            setTimeLeft(0)

        } catch (error) {
            console.log('error', error)
            let errorMessage;
            if (error && error.data) {
                errorMessage = error.data.message
            } else {
                errorMessage = error.message;
            }
            notify('error', 'Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const CancelAuction = async () => {
        try {
            setLoading(true)
            const gas = await dutchContract.methods.Cancel().estimateGas({ from: account });
            const result = await dutchContract.methods.Cancel().send({ from: account, gas: gas });
            getNftData();
            console.log('result', result)
            setTimeLeft(0)
            setCurrentPrice(0)
            toast('warning', "Auction Cancelled")
        } catch (error) {
            console.log('error', error)
            let errorMessage;
            if (error && error.data) {
                errorMessage = error.data.message
            } else {
                errorMessage = error.message;
            }
            notify('error', 'Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }
    const EndAuction = async () => {
        try {
            setLoading(true)
            const gas = await dutchContract.methods.endAuction().estimateGas({ from: account });
            const result = await dutchContract.methods.endAuction().send({ from: account, gas: gas });
            getNftData();
            setTimeLeft(0)
            setCurrentPrice(0)
            console.log('result', result)
            toast('success', "Auction Ended")
        } catch (error) {
            console.log('error', error)
            let errorMessage;
            if (error && error.data) {
                errorMessage = error.data.message
            } else {
                errorMessage = error.message;
            }
            notify('error', 'Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const OnlyOwner = async () => {
            try {
                const owner = await dutchContract.methods.owner().call();
                console.log('owner is :', owner)
                console.log('acccount is :', account)
                if (owner.toLowerCase() === account.toLowerCase()) {
                    console.log('accounts are matched', true)
                    setOnlyOwner(true)
                } else {
                    console.log('accounts not matched', false)
                    setOnlyOwner(false)
                }

            } catch (error) {
                console.log('error form only owner', error)
            }
        }
        OnlyOwner();
    }, [account]);
    const NoOffer = async () => {
        toast('info','Not any offer on this item.')

    }




    return (
        <div className='mb-5'>
            <Container>
                <Row xxl={2} xl={2} md={2} sm={1} xs={1} className="">
                    <Col className="text-start mt-5 ">


                        <Card className="m-0 p-0 w-100 rounded-4 shadow" >
                            <div className="d-flex text-end pt-2 ps-2">
                                <i ><FaEthereum /></i>
                                <p className="me-auto">#: {tokenId}</p>
                            </div>
                            <CardContent className="m-0   zoomContainer ">
                                <img className=" w-100 rounded-2 h-50 zoomImage" src={nftMetadata.image} alt="logo" />
                            </CardContent>
                        </Card>
                        <Card className="mt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i><HiMenuAlt2 /></i>
                                <h6 className="ms-2 mt-1">Description</h6>
                            </div>
                            <CardContent className="OverFlowY text-secondary" style={{ height: '200px' }}>
                                {nftMetadata.description.length > 0 ? <p>{nftMetadata.description}</p> : <p>No description</p>}

                            </CardContent>
                        </Card>

                    </Col>
                    {loading && (
                        <div className="m-auto  bg-successk" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, position: 'absolute' }}>

                            <Player className="bg-k " src='https://lottie.host/5a71c736-8150-4cf0-b870-7d97d992f1bc/y3KFjegVpO.json' loop autoplay style={{ height: '150px', width: '150px' }} />
                        </div>
                    )}

                    <Col className="text-start mt-5 mb-5">
                        <h3>{nftMetadata.name}</h3>
                        <p className="text-bold">Address: {nftContAddress}</p>
                        <p className="text-bold mb-5">OwnerOf: {ownerOf}</p>

                        <Card className="mt-5 pt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i className=""><FaRegClock /></i>
                                <p className=" ms-2"> schedule Sale ends 28 February 2025 at dutch auction </p>
                            </div>
                            <div className="d-flex mb- pb-0 ">

                                <h3 className="fw-bold ps-2 m-3">{currentPrice} ETH</h3>

                                <h3 className="mt-3">{minutes}:{String(seconds).padStart(2, '0')}</h3>
                                <p className="ms-2  mt-4  text-muted">Remaing time</p>

                            </div>
                            <div className="d-flex">
                            <p className="mb-0 ms-4 mt-0 pt-0 pb-0">Current Price</p>
                            <p>/</p>
                            <p className={!timeLeft == 0? "d-none":"mb-0  mt-0 pt-0 pb-0"}>/Sale Ended</p>
                            </div>

                            <CardContent className="mt-0 pt-0">


                                <div className="d-flex mt-2">
                                    {onlyOwner ? (
                                        <>
                                            <Button onClick={EndAuction} size="large" className="w-100 me-2 ms-1 bg-danger rounded-4 " variant="contained">End Auction </Button>
                                            <Button onClick={CancelAuction} size="large" className="w-100 me-1 ms-2 bg-info rounded-4" variant="contained" style={{ backgroundColor: 'lightgray' }}>Cancel</Button>
                                        </>

                                    ) : (
                                        <>
                                            <Button onClick={Buying} disabled={timeLeft == 0} size="large" className="w-100 me-2 ms-1   rounded-4 " variant="contained">Buy</Button>
                                            <Button onClick={NoOffer} size="large" className="w-100 me-1 ms-2  rounded-4" variant="contained" style={{ backgroundColor: 'lightgray' }}>Make offer</Button>
                                        </>
                                    )}

                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i><MdAutoGraph /></i>
                                <h6 className="ms-2 mt-1">Price</h6>
                            </div>
                            <CardContent style={{ height: '260px' }}>

                            </CardContent>
                        </Card>

                    </Col>


                </Row>
            </Container>
        </div>
    )
};

export default DutchAuctonBidding;
