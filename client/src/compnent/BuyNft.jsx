import React, { useContext, useEffect, useState } from "react"
import { CardHeader, Col, Container, Row } from "react-bootstrap";
import { Button, Card, CardActionArea, CardContent, div, IconButton, Tooltip } from "@mui/material";
import { MdAutoGraph, MdFavorite, MdFavoriteBorder, MdShower } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaArtstation, FaEthereum, FaHeart, FaRegClock, FaRegEye, FaRegHeart, FaTools } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BlockchainContext } from "../Web3Connection/Connection";
import { IoMdCart } from "react-icons/io";
import { notify } from "./Notify";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate, useParams } from "react-router-dom";


const BuyNft = (props) => {
    const { web, nftContract, nftContAddress, account } = useContext(BlockchainContext)
    const [loading, setLoading] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [tokenId, setTokenId] = useState(0);
    const [ownerOf, setOwnerOf] = useState();
    const [alltokenIds, setAlltokenIds] = useState([]);
    const [nftPrice, setNftPrice] = useState([]);
    const [history, setHistory] = useState([]);
    const [mainPrice, setMainPrice] = useState();
    const [liked, setLiked] = useState(false);
    const [nfts, setNfts] = useState([]);
    const navigate = useNavigate();
    const { Id } = useParams()
    console.log('ids from params:', Id)

    const [nftMetadata, setNftMetadata] = useState({
        image: 'https://img.freepik.com/free-vector/gradient-nft-concept-illustrated_23-2148948865.jpg?w=740&t=st=1728028709~exp=1728029309~hmac=86c51c2b2d5650e1374927cb1158e06da5ee13c464e6a05a32061a5f3dafbd69',
        name: '',
        description: ''
    });






        const getNftData = async () => {
            try {
                setLoading(true)
                console.log('id is:',Id)
                const owner = await nftContract.methods.ownerOf(Id).call();
                setOwnerOf(owner)

                const price = await nftContract.methods.price(Id).call();
                setMainPrice(Number(web.utils.fromWei(price, 'ether')))

                const history = await nftContract.methods.getOwnershipHistory(Id).call();
                setHistory(history)
                const tokenURI = await nftContract.methods.tokenURI(Id).call();
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
    useEffect(() => {

        getNftData()
    }, [ ,Id]);
    const getAllTokens = async () => {
        try {
            setLoading(true)
            const ownerOf = await nftContract.methods.ownerOf(Id).call();
            const tokenIds = await nftContract.methods.getAddressTokenIds(ownerOf).call();
            // getNftData(tokenIds[0])

            const TokenIdsPromises = tokenIds.map(tokenId => Number(tokenId))
            const TokenIds = await Promise.all(TokenIdsPromises)
            console.log('token ids from address', TokenIds)


            setAlltokenIds(TokenIds)
            const tokenURIPromises = TokenIds.map(tokenId => nftContract.methods.tokenURI(tokenId).call());
            const tokenURIs = await Promise.all(tokenURIPromises);

            const metadataPromises = tokenURIs.map(uri => fetch(uri).then(response => response.json()));
            const allNftsMetadata = await Promise.all(metadataPromises);

            const formattedMetadata = allNftsMetadata.map(data => ({
                image: data.image,
                name: data.name,
                description: data.description,

            }));
            setNfts(formattedMetadata)

            const pricePromises = tokenIds.map(tokenId => nftContract.methods.price(tokenId).call());
            const pricesValues = await Promise.all(pricePromises);

            const bigNumberPromises = pricesValues.map(bigNumbers => Number(web.utils.fromWei(bigNumbers, 'ether')))
            const bigvalues = await Promise.all(bigNumberPromises);

            setNftPrice(bigvalues)
            console.log('nft price from all tokens', bigvalues)

        } catch (error) {
            console.error("Error fetching all tokens:", error);
        }finally{
            setLoading(false)
        }
    };





    useEffect(() => {
        getAllTokens()
    }, [nftContract]);


    //-------------------------------------------------------------------------------------------------------
    // const nftTokenPrice = async () => {
    //     try {
    //         setLoading(true)
    //         const result = await nftContract.methods.price(tokenId).call();
    //         const price = Number(result)
    //         const amount = web.utils.fromWei(price, 'ether');
    //         console.log("amount price is: ", amount)
    //         setNftPrice(amount)
    //     } catch (error) {
    //         console.log('error', error)

    //     } finally {
    //         setLoading(false)
    //     }
    // }


    const buyNft = async () => {
        setLoading(true)
        const tokenPriceInWei = await nftContract.methods.price(Id).call();
        console.log('token Id and amount', tokenId, 'acmount:',tokenPriceInWei)
        try {
            
            
            const gas = await nftContract.methods.buyNft(Id).estimateGas({ from: account, value: tokenPriceInWei });
            const result = await nftContract.methods.buyNft(Id).send({ from: account, gas: gas, value: tokenPriceInWei });
            console.log('result',result)
            getAllTokens()
            getNftData()
            notify('success', 'Successfull', `Nft token ${Id} sucessfully bought`)
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

    const check = async () => {
        if (nftPrice[0] === 0) {
            console.log('true')
        } else {
            console.log('false')
        }


    }

    return (
        <div className='mb-5'>
            <Container>
                <Row xxl={2} xl={2} md={2} sm={1} xs={1} className="">
                    <Col className="text-start mt-5 ">


                        <Card className="m-0 p-0 w-100 rounded-4 shadow" >
                            <div className="d-flex text-end pt-2 ps-2">
                                <i ><FaEthereum /></i>
                                <p className="me-auto">#: {Id}</p>
                            </div>
                            <CardContent className="m-0 p-3  zoomContainer ">
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
                    {transferLoading && (
                        <div className="m-auto  bg-successk" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, position: 'absolute' }}>
                            {/* Payment success logo <Player style={{ height: '250px', width: '250px' }} src='https://lottie.host/5772bac7-94fb-4398-9cea-ab09a366eabd/odhdtXD42F.json' loop autoplay /> */}
                            <Player className="" style={{ height: '150px', width: '150px' }} src='https://lottie.host/433a30f9-2c27-4bf6-b9ea-27b94bb0913e/hxqmvJo8de.json' loop autoplay />

                        </div>
                    )}

                    <Col className="text-start mt-5">
                        <h3>{nftMetadata.name}</h3>
                        <p className="text-bold mt-2">Owner Of: {ownerOf}</p>
                        <p className="text-bold">Connected: {account}</p>
                        <div className="d-flex mt-5 pt-4 ps-2 mb-3">
                            <div className="d-flex me-4 mt-1"><i><FaRegEye /></i><p className="ms-1">81 view</p></div>
                            <div className="d-flex me-4 mb-3 mt-0 pt-0"><i>
                                <IconButton className={liked ? 'd-inline mt-0 pt-0  me-4"' : 'd-none  me-4"'} onClick={() => setLiked(false)} >
                                    <FaHeart className="text-success pb-1" />
                                </IconButton>

                                <IconButton className={liked ? 'd-none ' : 'd-inline mt-0 pt-0  me-4"'} onClick={() => setLiked(true)} >
                                    <FaRegHeart className=" pb-1" />
                                </IconButton>
                            </i><p className="mt-1"> favorite</p></div>


                            <div className="d-flex mt-1"><i><FaArtstation /></i><p className="ms-1"> Art</p></div>

                        </div>
                        <Card className="mt-4 pt-3 mt-5 rounded-4 shadow">
                            <div className="d-flex pt-2 ps-3">
                                <i className=""><FaRegClock /></i>
                                <p className=" ms-2"> schedule Sale ends 28 February 2025 at 5:27 am</p>
                            </div>
                            <CardContent>
                                <p>Current Price</p>
                                <div className="d-flex">
                                    <h4>{mainPrice} ETH</h4>
                                    {/* <p className="text-muted ms-2 mt-1">$ {nftPrice * 2370.92}</p>
                                    {nftPrice == 0 ? <h5 className="ms-2 text-muted">Not for sale</h5> : null} */}
                                </div>

                                <div className="d-flex">
                                    <Button onClick={buyNft} size="large" className="w-100 me-2 ms-1 rounded-3 " variant="contained">Buy</Button>
                                    <Button onClick={getAllTokens }    size="large" className="w-100 me-1 ms-2 rounded-3" variant="contained" style={{ backgroundColor: 'lightgray' }}>Make offer</Button>
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
                                                <TableCell>#{Id}</TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip title='Demo content' arrow placement="top">
                                            <TableRow hover>
                                                <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                                <TableCell>0x21F9720a12D72728B885acfD47AA213468655968</TableCell>
                                                <TableCell>#{Id}</TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip title='Demo content' arrow placement="top">
                                            <TableRow hover>
                                                <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                                <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                                <TableCell>#{Id}</TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip title='Demo content' arrow placement="top">
                                            <TableRow hover>
                                                <TableCell>0x31032F34E7812C17e639D748F0B9E4668b659422</TableCell>
                                                <TableCell>0x5cD98E0f51e6d38EBE827534be06a827720f69B4</TableCell>
                                                <TableCell>#{Id}</TableCell>
                                            </TableRow>
                                        </Tooltip>
                                        <Tooltip title='Demo content' arrow placement="top">
                                            <TableRow hover>
                                                <TableCell>0xeD23fD8ABa5822d8008c291d71D437222a7120f8</TableCell>
                                                <TableCell>0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1</TableCell>
                                                <TableCell>#{Id}</TableCell>
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
                        <CardContent className="d-flex MoreCollection">
                            {nfts.length > 0 ? nfts.map((item, i) => (
                                <div className="  ms-2 me-2" key={i}>

                                    <div className="ImageEffect shadow  pb-2 rounded-5 " onClick={() => { navigate(`/nftbuy/${alltokenIds[i]}`) }} style={{ cursor: 'pointer', height: '350px', width: '280px' }}>
                                        <div className="zoomContainer rounded-5   " style={{ height: '220px' }} >
                                            <img className=" zoomImage w-100 h-100" src={item.image} alt="" />
                                        </div>
                                        <div className="mt-3 d-flex me-3 ms-3">
                                            <h6>{item.name}</h6>
                                            <h6 className="text-end ms-auto">#: {alltokenIds[i]}</h6>
                                        </div>

                                        <h5 className="text-start ms-3">{nftPrice[i]} ETH</h5>


                                        <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 WETH</p>
                                        <div className="BuyButton mt-4 pt-1 rounded-bottom-5 w-100">
                                            <div className=" w-100  d-flex  text-white p-1">
                                                <h6 className="mx-auto ps-5">Buy</h6>
                                                <i className="text-end ms-auto pe-3"><IoMdCart /></i>
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

export default BuyNft;
