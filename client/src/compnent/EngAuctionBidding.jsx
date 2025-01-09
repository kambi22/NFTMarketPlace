import React, { useContext, useEffect, useState } from "react"
import { CardHeader, Col, Container, Row } from "react-bootstrap";
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
import { timeline } from "animejs";
const EngAuctionBidding = (props) => {
    const { web, nftContract, engContract, nftContAddress, account } = useContext(BlockchainContext)

    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState();
    const [ownerOf, setOwnerOf] = useState();
    const [price, setPrice] = useState();
    const [highestBid, setHighestBid] = useState();
    const [onlyOwner, setOnlyOwner] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [nftMetadata, setNftMetadata] = useState({
        image: "https://img.freepik.com/free-psd/nft-cryptocurrency-3d-illustration_1419-2742.jpg?t=st=1730800651~exp=1730804251~hmac=a56fbd83d0b34c8ea65bc0c648a2316641573d07d2cf2ed247c07d7ab5a6dfd0&w=740",
        name: '',
        description: ''
    });

    const [nftsUris, setNftsUris] = useState([]);
    const [nfts, setNfts] = useState([]);


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




    const getNftData = async () => {
        try {
            const tokenId = await engContract.methods.tokenId().call();
            const highestBid = await engContract.methods.highestBid().call();
            const highestBidder = await engContract.methods.highestBidder().call();
            const checkTime = await engContract.methods.checkTime().call();
            const owner = await engContract.methods.owner().call();
            setOwnerOf(owner)
            setTokenId(Number(tokenId))
            setHighestBid(Number(web.utils.fromWei(highestBid, 'ether')))

            setTimeLeft(Number(checkTime))


            const ownerof = await nftContract.methods.ownerOf(tokenId).call();


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
    }, [engContract]);
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


    const Bidding = async () => {
        try {
            setLoading(true)
            const gas = await engContract.methods.Bid().estimateGas({ from: account, value: web.utils.toWei(highestBid, 'ether') });
            const result = await engContract.methods.Bid().send({ from: account, gas: gas, value: web.utils.toWei(highestBid, 'ether') });
            console.log("sellt nft token", result)
            toast('success', `Successfully bid with ${highestBid} ETH`)
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
            const gas = await engContract.methods.Cancel().estimateGas({ from: account });
            const result = await engContract.methods.Cancel().send({ from: account, gas: gas });
            getNftData();
            console.log('result', result)
            setTimeLeft(0)
            toast('warning', "Auction Canceld")
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
            const gas = await engContract.methods.EndTime().estimateGas({ from: account });
            const result = await engContract.methods.EndTime().send({ from: account, gas: gas });
            getNftData();
            setTimeLeft(0)
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
                const owner = await engContract.methods.owner().call();
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
    const time = () => {
        setTimeLeft(0)
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
                        <p className="text-bold">OwnerOf: {ownerOf}</p>
                        <p className="text-bold mb-5">Connected: {account}</p>

                        <Card className="mt-5 pt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i className=""><FaRegClock /></i>
                                <p className=" ms-2"> schedule Sale ends 28 February 2025 at </p>
                            </div>
                            <div className="d-flex mb- pb-0 ">

                                {timeLeft == 0 ? <i className="text-muted ms-4 me-3 pe-2 ps-2 mt-4 pt-2" ><FaRegClock style={{ height: '33px', width: '33px' }} /></i>
                                    :
                                    <Player className="" style={{ height: '100px', width: '100px' }} src='https://lottie.host/bdf8e028-2df8-4e28-aae5-1524da0018dc/0V7zRmXvm4.json' loop autoplay />
                                }

                                <h3 className="mt-4 pt-2">{minutes}:{String(seconds).padStart(2, '0')}</h3>
                                <p className="ms-2 mt-4 pt-3  text-muted">Remaing time</p>
                            </div>
                          

                            <CardContent className="mt-0 pt-0">
                            <div className="d-flex">
                            <p className="mb-0 ms-4 mt-0 pt-0 pb-0">Current Price</p>
                            
                            <p className={!timeLeft == 0? "d-none":"mb-0  mt-0 pt-0 pb-0"}>/Sale Ended</p>
                            </div>
                                <div className="d-flex mt-0 pt-0">
                                    <TextField className="mb-2 w-100" size='medium' placeholder="Set nft selling price in ETH" id="price" type="number" name="price " required onChange={(e) => setHighestBid(e.target.value)} value={highestBid} />
                                </div>

                                <div className="d-flex mt-2">
                                    {onlyOwner ? (
                                        <>
                                            <Button onClick={EndAuction} size="large" className="w-100 me-2 ms-1 bg-danger rounded-4 " variant="contained">End Auction </Button>
                                            <Button onClick={CancelAuction} size="large" className="w-100 me-1 ms-2 bg-info rounded-4" variant="contained" style={{ backgroundColor: 'lightgray' }}>Cancel</Button>
                                        </>

                                    ) : (
                                        <>
                                            <Button onClick={Bidding} disabled={timeLeft == 0} size="large" className="w-100 me-2 ms-1   rounded-3 " variant="contained">Bid</Button>
                                            <Button onClick={time} size="large" className="w-100 me-1 ms-2  rounded-3" variant="contained" style={{ backgroundColor: 'lightgray' }}>Make offer</Button>
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
                    {/* <Card className="mt-3 w-100">
                        <div className="d-flex pt-2 ps-3">
                            <i><FiActivity /></i>
                            <h6 className="ms-2 mt-1">Item Activity</h6>
                        </div>
                        <CardContent className="OverFlowY" style={{ height: '300px' }}>
                            <TableContainer className='mx-auto bg-'>

                                <Table className="bg- w-100" style={{ fontSize: '20px' }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '' }}>

                                            <TableCell className='text-'>From</TableCell>
                                            <TableCell className='text-'>To </TableCell>
                                            <TableCell className='text-'>Token Id</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {[...history].reverse().map((item, i) => (
                                            <TableRow hover key={i}>
                                                <TableCell>{item.from}</TableCell>
                                                <TableCell>{item.to}</TableCell>
                                                <TableCell>#{tokenId}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow hover>
                                            <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                            <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                            <TableCell>25.05.2025</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                            <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                            <TableCell>25.05.2025</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                            <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                            <TableCell>25.05.2025</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                            <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                            <TableCell>25.05.2025</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                            <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                            <TableCell>25.05.2025</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </CardContent>
                    </Card> */}
                    {/* <Card className="mt-3 w-100 rounded-3 text-secondary">
                        <CardHeader className="fw-bold text-start h3 ps-4 pt-4 ">More collections</CardHeader>
                        <hr />
                        <CardContent>
                        <Row xxl={5} xl={5} md={4} sm={2} xs={1} className=" mt-1 w-100   mx-auto">
                                {nfts.length > 0 ? nfts.map((item, i) => (
                                    <Col className="" key={i}>
                                           
                                        
                                        <div className="ImageEffect shadow  pb-2 rounded-3 w-100 mt-1 " onClick={() => getNftData(i + 1)} style={{ cursor: 'pointer', height: '330px', width: '250px' }}>
                                            <div className="zoomContainer rounded-3  " >
                                                <img className=" zoomImage w-100 h-100" src={item.image} alt="" />
                                            </div>
                                            <div className="mt-2 d-flex me-3 ms-3">
                                                <h6>{item.name}</h6>
                                                <h6 className="text-end ms-auto">#: {i + 1}</h6>
                                            </div>
                                            
                                                <h5  className="text-start ms-3">{nftPrice[i]} ETH</h5>

                                           
                                            <p className="text-start LastSale ms-3">Last Sale: 0.05 WETH</p>
                                            <div className="BuyButton rounded-bottom-3 w-100">
                                                <div className=" w-100  d-flex  text-white p-1">
                                                    <h6 className="mx-auto ps-4">Buy</h6>
                                                    <i className="text-end ms-auto pe-2"><IoMdCart /></i>
                                                </div>
                                            </div>
                                        </div>
                                            

                                    </Col>


                                )) : (
                                    <div className="text-center w-100">
                                        <h4>No Any Collection</h4>
                                        <p>If any nft token minted on this address, show here</p>
                                    </div>
                                )}
                            </Row>
                        </CardContent>
                        <CardActionArea>

                        </CardActionArea>
                    </Card> */}

                </Row>
            </Container>
        </div>
    )
};

export default EngAuctionBidding;
