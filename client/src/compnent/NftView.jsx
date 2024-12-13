import React, { useContext, useEffect, useState } from "react"
import { CardHeader, Col, Container, Row } from "react-bootstrap";
import { Alert, AlertTitle, Box, Button, Card, CardActionArea, CardContent, div, TextareaAutosize, TextField, Tooltip } from "@mui/material";
import { MdAutoGraph } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaCheckCircle, FaEthereum, FaRegClock } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BlockchainContext } from "../Web3Connection/Connection";
import { IoMdCart } from "react-icons/io";
import { notify, toast } from "./Notify";
import { Player } from "@lottiefiles/react-lottie-player";
import Aos from "aos";


const NftView = (props) => {
    const { web, nftContract, nftContAddress, account } = useContext(BlockchainContext)
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState();
    const [alltokensIds, setAlltokensIds] = useState([]);
    const [ownerOf, setOwnerOf] = useState();
    const [price, setPrice] = useState();
    const [nftPrice, setNftPrice] = useState();
    const [history, setHistory] = useState([]);
    const [showAlert, setShowAlert] = useState(false);


    const [nftMetadata, setNftMetadata] = useState({
        image: "https://img.freepik.com/free-psd/nft-cryptocurrency-3d-illustration_1419-2742.jpg?t=st=1730800651~exp=1730804251~hmac=a56fbd83d0b34c8ea65bc0c648a2316641573d07d2cf2ed247c07d7ab5a6dfd0&w=740",
        name: '',
        description: ''
    });

  

    const [nftsUris, setNftsUris] = useState([]);
    const [nfts, setNfts] = useState([]);
    useEffect(() => {
        Aos.init({
            duration: 1000
        })
    }, []);
    const handleClick = () => { setShowAlert(true); };
    const getNftData = async (tokenId) => {
        try {
            setTokenId(tokenId)
            const balance = await nftContract.methods.balanceOf(account).call();
            const tokens = Number(balance);
            if (tokens === 0) {
                setTokenId(null)
                setNftMetadata({
                    image: "https://img.freepik.com/free-psd/nft-cryptocurrency-3d-illustration_1419-2742.jpg?t=st=1730800651~exp=1730804251~hmac=a56fbd83d0b34c8ea65bc0c648a2316641573d07d2cf2ed247c07d7ab5a6dfd0&w=740",
                    name: "",
                    description: ""
                })
                console.log('true', true)

            } else {

                console.log('false', false)

                console.log("token id from nftdataget:", tokens)
                const owner = await nftContract.methods.ownerOf(tokenId).call();
                setOwnerOf(owner)

                const price = await nftContract.methods.price(tokenId).call();
                setPrice(Number(web.utils.fromWei(price, 'ether')));

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
            }
        } catch (error) {
            console.log("error to fetch nft data")
        }
    }

    const getAllTokens = async () => {
        try {
            const tokenIds = await nftContract.methods.getAddressTokenIds(account).call()
            getNftData(tokenIds[0])
            const TokenIdsPromises = tokenIds.map((int) => Number(int));
            const TokenIds = await Promise.all(TokenIdsPromises)
            console.log('token ids are:', tokenIds);
            setAlltokensIds(TokenIds)
            setTokenId(TokenIds[0])



            const tokenURIPromises = TokenIds.map(tokenId => nftContract.methods.tokenURI(tokenId).call());
            const tokenURIs = await Promise.all(tokenURIPromises);
            setNftsUris(tokenURIs);


            const pricePromises = TokenIds.map(tokenId => nftContract.methods.price(tokenId).call());;;
            const pricesValues = await Promise.all(pricePromises);

            const bigNumberPromises = pricesValues.map(bigNumbers => Number(web.utils.fromWei(bigNumbers, 'ether')))
            const bigvalues = await Promise.all(bigNumberPromises);

            setNftPrice(bigvalues);
            console.log('nft price big values are:', bigvalues);

            const metadataPromises = tokenURIs.map(uri => fetch(uri).then(response => response.json()));
            const allNftsMetadata = await Promise.all(metadataPromises);

            const formattedMetadata = allNftsMetadata.map(data => ({
                image: data.image,
                name: data.name,
                description: data.description,

            }));
            setNfts(formattedMetadata);
            console.log('formatedmedata with price values:', formattedMetadata);

        } catch (error) {
            console.error("Error fetching all tokens:", error);
        }
    };

    useEffect(() => {
        getAllTokens()

    }, [account]);


    //-------------------------------------------------------------------------------------------------------------------------------------

    const sellNftToken = async () => {
        try {
            setLoading(true)
            const amount = web.utils.toWei(price, 'ether');
            console.log('amount price is', amount)
            const gas = await nftContract.methods.sellNft(tokenId, amount).estimateGas({ from: account });
            const result = await nftContract.methods.sellNft(tokenId, amount).send({ from: account, gas: gas });
            console.log("sellt nft token", result)
            setShowAlert(true)
            getAllTokens()

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

    const check = async (tokenIde) => {
        try {
            console.log("token id from nftdataget:", tokenIde)
            setTokenId(tokenId)

            const owner = await nftContract.methods.ownerOf(tokenIde).call();
            setOwnerOf(owner)
            console.log('onerof nft', owner)

            const tokenURI = await nftContract.methods.tokenURI(tokenIde).call();
            fetch(tokenURI)
                .then(response => response.json())
                .then(data => {
                    setNftMetadata({
                        image: data.image,
                        name: data.name,
                        description: data.description
                    })
                    console.log('image', data.image)
                    console.log('name', data.name)
                    console.log('description', data.description)
                });

            console.log("nft ids:", tokenURI)
        } catch (error) {
            console.log('error', error)
        }
    }

    async function getOwnedTokens() {
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
                console.log(`Token ID ${tokenId} does not exist or has been burned.`);
            }
        }
        console.log('owned tokens:', ownedTokens)
    }

    return (
        <div className='mb-5'>
           {showAlert && (
           <div className="   col-xl-3 col-sm-10 col-xs-10 mt-1   mx-auto rounded-3 text-succes ">
                    <Alert className="col-xl-3 col-sm-10 col-xs-10 mt-0 m-2 text-start rounded-3 text-success" data-aos="fade-down" icon={<FaCheckCircle />} onClose={() => setShowAlert(false)} style={{ backgroundColor: '#bcf5bc',zIndex: 1,position:'absolute' }} >
                        <AlertTitle>Success</AlertTitle>
                        The item has been successfully put up for sale
                    </Alert>
           </div>
                )}
             
            <Container className="text-center">
           
                <Row xxl={2} xl={2} md={2} sm={1} xs={1} className="">
               
                    <Col className="text-start mt-5 ">


                        <Card className="m-0 p-0 w-100 rounded-4 shadow" >
                            <div className="d-flex text-end pt-2 ps-2">
                                <i ><FaEthereum /></i>
                                <p className="me-auto">#: {tokenId}</p>
                            </div>
                            <CardContent className="m-0   zoomContainer ">
                                <img className=" w-100 rounded-3 h-50 zoomImage" src={nftMetadata.image} alt="logo" />
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


                    <Col className="text-start mt-5">
                        <h3>{nftMetadata.name}</h3>


                        <p className="text-bold mt-3">OwnerOf: {ownerOf}</p>
                        <p className="text-bold mb-5 " >Connected: {account}</p>

                        <Card className="mt-5 pt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i className=""><FaRegClock /></i>
                                <p className=" ms-2"> schedule Sale ends 28 February 2025 at 5:27 am</p>
                            </div>
                            <CardContent>
                                <p>Set Price</p>
                                <div className="d-flex">
                                    <TextField className="mb-2 w-100" size='medium' placeholder="Set nft selling price in ETH" id="price" type="number" name="price " required onChange={(e) => setPrice(e.target.value)} value={price} />
                                </div>

                                <div className="d-flex">
                                    <Button onClick={sellNftToken} size="large" className="w-100 me-2 ms-1 bg-warning rounded-4 " variant="contained">SEll</Button>
                                    <Button onClick={handleClick} size="large" className="w-100 me-1 ms-2 rounded-4" variant="contained" style={{ backgroundColor: 'lightgray' }}>Make offer</Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mt-3 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i><MdAutoGraph /></i>
                                <h6 className="ms-2 mt-1">Price</h6>
                            </div>
                            <CardContent style={{ height: '260px' }}>
                                <p className="text-muted">Not Available</p>

                            </CardContent>
                        </Card>

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
                    <Card className="mt-3 w-100 rounded-4 text-secondary rounded-4 shadow">
                        <CardHeader className="fw-bold text-start h3 ps-4 pt-4 ">More collections</CardHeader>
                        <hr />
                        <CardContent className="MoreCollection d-flex">

                            {nfts.length > 0 ? nfts.map((item, i) => (
                                <div className="ms-2 me-2" key={i}>


                                    <div className="ImageEffect shadow  pb-2 rounded-5  mt-1  " onClick={() => getNftData(alltokensIds[i])} style={{ cursor: 'pointer', height: '350px', width: '280px' }}>
                                        <div className="zoomContainer rounded-5   " style={{ height: '220px' }} >
                                            <img className=" zoomImage w-100 h-100" src={item.image} alt="" />
                                        </div>
                                        <div className="mt-3 d-flex me-3 ms-3">
                                            <h6>{item.name}</h6>
                                            <h6 className="text-end ms-auto">#: {alltokensIds[i]}</h6>
                                        </div>

                                        <h5 className="text-start ms-3">{nftPrice[i]} ETH</h5>


                                        <p className="text-start mt-4 ms-3">Last Sale: 0.05 WETH</p>

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

export default NftView;
