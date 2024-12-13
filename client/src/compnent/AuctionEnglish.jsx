import React, { useContext, useEffect, useState } from "react"
import { CardHeader, Col, Container, Row } from "react-bootstrap";
import gold from './images/bols.jpeg'
import { Alert, AlertTitle, Button, Card, CardActionArea, CardContent, div, Fab, InputAdornment, TextField, Tooltip } from "@mui/material";
import { MdAutoGraph, MdFavorite, MdFavoriteBorder, MdShower } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaArtstation, FaCheckCircle, FaEthereum, FaIdBadge, FaOrcid, FaRegClock, FaRegEye, FaTools } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { FaArrowTrendDown, FaArrowTrendUp, FaLocationDot } from "react-icons/fa6";
import { IoMdCart } from "react-icons/io";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { BlockchainContext } from "../Web3Connection/Connection";
import { notify, toast } from "./Notify";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router";
import Aos from "aos";
const AuctionEnglish = (props) => {
    const { web, nftContract,engContract,engAddress, nftContAddress, account } = useContext(BlockchainContext)

    const [ownerOf, setOwnerOf] = useState();
    const [duration, setDuration] = useState();
    const [nftItem, setNftItem] = useState(nftContAddress);
    const [tokenId, setTokenId] = useState();
    const [alltokenIds, setAlltokenIds] = useState([]);
    const [history, setHistory] = useState([]);
    const [price, setPrice] = useState([]);
    const [nftPrice, setNftPrice] = useState([]);
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    
    const navigate = useNavigate();

    const [nftMetadata, setNftMetadata] = useState({
        image: "https://img.freepik.com/free-psd/nft-cryptocurrency-3d-illustration_1419-2742.jpg?t=st=1730800651~exp=1730804251~hmac=a56fbd83d0b34c8ea65bc0c648a2316641573d07d2cf2ed247c07d7ab5a6dfd0&w=740",
        name: '',
        description: ''
    });

    const getNftData = async (tokenId) => {
        try {

            setLoading(true)
            setTokenId(tokenId)
            const owner = await nftContract.methods.ownerOf(tokenId).call();
            setOwnerOf(owner)

            const history = await nftContract.methods.getOwnershipHistory(tokenId).call();
            setHistory(history)

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
        }finally{
            setLoading(false)
        }
    }
    const getAllTokens = async () => {
        try {

            let ownedTokens = [];

            for (let tokenId = 1; tokenId <= 10; tokenId++) {
                try {
                    const currentOwner = await nftContract.methods.ownerOf(tokenId).call();
                    if (currentOwner.toLowerCase() === account.toLowerCase()) {
                        ownedTokens.push(tokenId);
                        console.log('true')

                    }

                } catch (error) {
                    // Ignore errors for non-existent tokens
                    // console.log(`Token ID ${tokenId} does not exist or has been burned.`);
                }
            }
            console.log('owner all tokens:',ownedTokens)
            getNftData(ownedTokens[0])
            setAlltokenIds(ownedTokens)


            const tokenURIPromises = ownedTokens.map(tokenId => nftContract.methods.tokenURI(tokenId).call());
            const tokenURIs = await Promise.all(tokenURIPromises);
    
            const pricePromises = ownedTokens.map(tokenId => nftContract.methods.price(tokenId).call());
            const pricesValues = await Promise.all(pricePromises);

            const bigNumberPromises = pricesValues.map(bigNumbers => Number(web.utils.fromWei(bigNumbers, 'ether')))
            const bigvalues = await Promise.all(bigNumberPromises);
            console.log('nft items price:',bigvalues)
            setNftPrice(bigvalues)

            const metadataPromises = tokenURIs.map(uri => fetch(uri).then(response => response.json()));

            const allNftsMetadata = await Promise.all(metadataPromises);

            const formattedMetadata = allNftsMetadata.map(data => ({
                image: data.image,
                name: data.name,
                description: data.description,
                
            }));
            setNfts(formattedMetadata)
            console.log('formatedmedata with price values:',formattedMetadata)

        } catch (error) {
            console.error("Error fetching all tokens:", error);
        }
    };
    useEffect(() => {
        getAllTokens()
      
    }, [nftContract,account]);
    
///----------------------------------------------------------------------------------------------------------------------

const StartBidding = async() => {
    try {
        setLoading(true)
        
        const priceEth = web.utils.toWei(price, 'ether')
        console.log('price eth',priceEth)
        const Gas = await nftContract.methods.setApprovalForAll(engAddress, true).estimateGas({from: account})
        const Approve = await nftContract.methods.setApprovalForAll(engAddress, true).send({from: account, gas: Gas})
        console.log('approved si:',Approve)
        const gas = await engContract.methods.StartBidding(nftContAddress, duration, tokenId, priceEth).estimateGas({from: account})
        const result = await engContract.methods.StartBidding(nftContAddress, duration, tokenId, priceEth).send({from: account, gas: gas})
        console.log("start bidding",result)
        navigate('bidding')
        toast('success','Item successfully put up for sale')
    } catch (error) {
        console.log('errr',error)
        let errorMessage;
        if (error && error.data && error.data.message) {
            errorMessage = error.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        } else {
            errorMessage = "Unexpected Error";
        }
        notify('error', 'Error', errorMessage)
    } finally {
        setLoading(false)
    }
}

useEffect(() => {
    Aos.init({
        duration: 1000
    })
}, []);

    return (
        <div className="mb-5 pb-5">
             {showAlert && (
           <div className="   col-xl-3 col-sm-10 col-xs-10 mt-1   mx-auto rounded-3 text-succes ">
                    <Alert className="col-xl-3 col-sm-10 col-xs-10 mt-0 m-2 text-start rounded-3 text-success" data-aos="fade-down" icon={<FaCheckCircle />} onClose={() => setShowAlert(false)} style={{ backgroundColor: '#bcf5bc',zIndex: 1,position:'absolute' }} >
                        <AlertTitle>Success</AlertTitle>
                        The item has been successfully put up for sale
                    </Alert>
           </div>
                )}
            <Container>
                <Row xxl={2} xl={2} md={2} sm={1} xs={1} className="">
                    <Col className="text-start mt-5 ">


                        <Card className="m-0 p-0 w-100 rounded-4 shadow" >
                            <div className="d-flex text-end pt-2 ps-2">
                                <i ><FaEthereum /></i>
                                <p className="me-auto">Id: {tokenId}</p>
                            </div>
                            <CardContent className="m-0 p-0 h-100  zoomContainer">
                                <img className=" w-100 rounded-2 h-50 zoomImage" src={nftMetadata.image} alt="logo" />
                            </CardContent>
                        </Card>
                        <Card className="mt-3 pb-2 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i><HiMenuAlt2 /></i>
                                <h6 className="ms-2 mt-1 ">Description</h6>
                            </div>
                            <CardContent className="OverFlowY" style={{ height: '200px' }}>
                            {nftMetadata.description}
                            </CardContent>
                        </Card>

                    </Col>
                    {loading && (
                        <div className="m-auto  bg-successk" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, position: 'absolute' }}>
                            <Player className="bg-k " src='https://lottie.host/5a71c736-8150-4cf0-b870-7d97d992f1bc/y3KFjegVpO.json' loop autoplay style={{ height: '150px', width: '150px' }} />
                        </div>
                    )}

                    <Col className="text-start mt-5">
                        <div className="Form text-start mx-auto" >
                            <h3 className="fw-bold ">Enlish Auction</h3>

                            <h3 className="mt-4">{nftMetadata.name}</h3>
                            <p className="text-bold">OwnerOf: {ownerOf}</p>
                            <p className="text-bold">Connected: {account}</p>
         

                            <div className="mt-5 ">
                            <label className="mt-4" >Token Id</label>
                                <TextField value={tokenId} onChange={(e) => getNftData(e.target.value)} InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="text-warning"><FaIdBadge /></i>
                                        </InputAdornment>
                                    )
                                }} className="w-100 ellipsedText"  placeholder="Enter Nft Item Token Id" type="number" id="id" name="id" required />


                                <label className="mt-4" >Collection Address</label>
                                <TextField InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="text-success"><FaLocationDot /></i>
                                        </InputAdornment>
                                    )
                                }} className="w-100 ellipsedText" placeholder="Enter Nft Item Address" type="address" id="address" name="address" value={nftItem} onChange={(e) => setNftItem(e.target.value)} />

                                <label className="mt-4" htmlFor="">Price</label>
                                <TextField InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className=""><FaEthereum /></i>
                                        </InputAdornment>
                                    )
                                }} className=" w-100  mt-2 ellipsedText"  required placeholder="Enter Auctionn item Price" type="number" id="price" name="price" value={price}  onChange={(e) => setPrice(e.target.value)} />


                                <label className="mt-4" htmlFor="">Duration </label>
                                <TextField InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="text-primary"><FaRegClock /></i>
                                        </InputAdornment>
                                    )
                                }} className="w-100 ellipsedText" placeholder="Enter Auctionn Duration Time" type="number" id="time" name="time" onChange={(e) => setDuration(e.target.value)} />

                                
                                <Button onClick={StartBidding} className="mt-5 w-100" size='large' variant="contained" >Start Auction</Button>
                            </div>

                        </div>
                    </Col>
                    <Card className="mt-3 w-100 rounded-4 shadow">
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
        
        <Tooltip title='Old owner' arrow placement="top">
            <TableCell>{item.from}</TableCell>
        </Tooltip>
        <Tooltip title='New owner' arrow placement="top">
            <TableCell>{item.to}</TableCell>
        </Tooltip>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
))}

<Tooltip title='Demo content' arrow placement="top">
    <TableRow hover>
        <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
        <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
</Tooltip>
<Tooltip title='Demo content' arrow placement="top">
    <TableRow hover>
        <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
        <TableCell>0x21F9720a12D72728B885acfD47AA213468655968</TableCell>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
</Tooltip>
<Tooltip title='Demo content' arrow placement="top">
    <TableRow hover>
        <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
        <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
</Tooltip>
<Tooltip title='Demo content' arrow placement="top">
    <TableRow hover>
        <TableCell>0x31032F34E7812C17e639D748F0B9E4668b659422</TableCell>
        <TableCell>0x5cD98E0f51e6d38EBE827534be06a827720f69B4</TableCell>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
</Tooltip>
<Tooltip title='Demo content' arrow placement="top">
    <TableRow hover>
        <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
        <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
        <TableCell>#{tokenId}</TableCell>
    </TableRow>
</Tooltip>
</TableBody>
                                </Table>
                            </TableContainer>

                        </CardContent>
                    </Card>
                    <Card className="mt-3 w-100 rounded-3 text-secondary rounded-4 shadow">
                        <CardHeader className="fw-bold text-start h3 ps-4 pt-4 ">More collections</CardHeader>
                        <hr />
                        <CardContent className="MoreCollection d-flex">
                      
                                {nfts.length > 0 ? nfts.map((item, i) => (
                                    <div className=" ms-2 me-2" key={i}>


                                        <div className="ImageEffect shadow  pb-2 rounded-5 mt-1  " onClick={() => getNftData(alltokenIds[i])} style={{ cursor: 'pointer', height: '350px', width: '280px' }}>
                                            <div className="zoomContainer rounded-5   " style={{height:'220px'}} >
                                                <img className=" zoomImage w-100 h-100" src={item.image} alt="" />
                                            </div>
                                            <div className="mt-3 d-flex me-3 ms-3">
                                                <h6>{item.name}</h6>
                                                <h6 className="text-end ms-auto">#: {alltokenIds[i]}</h6>
                                            </div>

                                            <h5 className="text-start ms-3">{nftPrice[i]} ETH</h5>


                                            <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.05 WETH</p>
                                            <div className="BuyButton mt-4 pt-1 rounded-bottom-5 w-100">
                                                <div className=" w-100  d-flex  text-white p-1">
                                                    <h6 className="mx-auto ps-4">Buy</h6>
                                                    <i className="text-end ms-auto pe-2"><IoMdCart /></i>
                                                </div>
                                            </div>
                                        </div>


                                    </div>


                                )) : (
                                    <div className="text-center w-100">
                                        <h4>No Any Collection</h4>
                                        <p>If any nft token minted on this address, show here</p>
                                    </div>
                                )}
                        
                        </CardContent>
                        <CardActionArea>

                        </CardActionArea>
                    </Card>
                </Row>
            </Container>
        </div>
    )
};

export default AuctionEnglish;
