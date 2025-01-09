import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, TextareaAutosize, TextField } from "@mui/material";
import React, { useContext, useState } from "react"
import { Col, Container, Row } from "react-bootstrap";
import { BlockchainContext } from "../Web3Connection/Connection";
import { Player } from "@lottiefiles/react-lottie-player";
import { notify } from "./Notify";
import upload from './images/upload.jpg'
import { PinataSDK } from "pinata-web3";
import { themeContext } from "../Context/themeContext";
import { FiDownloadCloud } from "react-icons/fi";
import Select, { SelectChangeEvent } from '@mui/material/Select';


const Nftminting = (props) => {
  const { web, nftContract, nftContAddress, account, } = useContext(BlockchainContext);
  const { isDark } = useContext(themeContext)
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState();
  const [imageView, setImageView] = useState();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(account);
  const [tokenURI, setTokenURI] = useState();
  const [description, setDescription] = useState();
  const [nftName, setNftName] = useState();
  const [type, setType] = useState('Art Collection');

  const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: "https://gateway.pinata.cloud",
  });
  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const imageUrl = URL.createObjectURL(file);
      setImageView(imageUrl)
      setIsImage(true)
      console.log("image url is:", imageUrl)
    }
  };

  // Function to handle drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);

      const imageUrl = URL.createObjectURL(file);
      setImageView(imageUrl)
      setIsImage(true)
      console.log("image url is:", imageUrl)

    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setImage(file);
    setIsImage(true)
  }
  const check = () => {


    console.log('jwt is:')


  }
  
  const handleChange = (event) => {
    setType(event.target.value);
    console.log('items:', event.target.value);
  };

  const Minting = async () => {
    if (isImage) {
      setLoading(true)
      const auth = await pinata.testAuthentication()
      console.log('auth', auth)

      try {

        const upload = await pinata.upload.file(image) // Ensure upload works
        console.log('image', upload);

        const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)

        console.log('ipfs url:', ipfsUrl)

        const metadata = pinata.upload.json({
          name: nftName,
          type: type,
          description: description,
          image: ipfsUrl,
          attributes: [
            {
              trait_type: "Background",
              value: "Blue"
            },
            {
              trait_type: "Eyes",
              value: "Green"
            },
            {
              trait_type: "Mouth",
              value: "Smile"
            }
          ]

        }).then(async (resp) => {
          setTokenURI(`https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`);

          try {
            setLoading(true)
            console.log(`https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`);

            const gasEstimate = await nftContract.methods.mintNft(address, `https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`).estimateGas({ from: account });
            const result = await nftContract.methods.mintNft(address, `https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`).send({ from: account, gas: gasEstimate });
            console.log('result mint nft', result)

            notify('success', 'Successful', 'Nft token success fully minted 🎉')

          } catch (error) {
            let errorMessage;
            console.log('error is', error)
            if (error && error.data && error.data.message) {
              errorMessage = error.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            } else {
              errorMessage = 'Unexpected Error';
            }
            notify('error', 'Error', errorMessage)
          }
          finally {
            setLoading(false)
          }



        })

      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false)
      }
    } else {
      notify('warning', 'Image Not Selected', 'Please select an image before mint token.')
    }
  }



  const ItemTypes = [{ id: 1, title: 'The Godfather' }, { id: 2, title: 'Pulp Fiction' }, { id: 3, title: 'The Shawshank Redemption' },];
  return (
    <div className="mt-5" >
      <Container className="mb-5 text-end"  >

        <div className="text-center  ">
          <div className="shadow d-md-none rounded-5 mt-5 GlassEffectFordiv mx-auto" onDrop={handleDrop} onDragOver={handleDragOver}
            style={{
              height: '300px', maxWidth: '400px', minWidth: '200px', cursor: 'pointer', left: '0px', zIndex: 1, top: '40px',
              position: 'relative', color: isDark ? 'white' : 'darkgray'
            }}  >
            <img src={imageView} alt="" className="w-100 h-100 rounded-5" style={{ position: 'absolute', left: '0px' }} />
            {/* position absolution for set properly on div */}
            <input type="file" accept="image/*" className="h-100 w-100" onChange={handleImageChange}
              style={{ cursor: 'pointer', position: 'absolute', opacity: 0 }} />
            {/* set opacity 0 for hide choose file button , accept = image/* fro only images formate are acceptable 
      like png, jpeg and gif other formates like videos are not acceptable ,absolution for set over div */}

            <i className=" mt-5"><FiDownloadCloud style={{ height: '80px', width: '80px', marginTop: '60px' }} /></i>
            <h3 className="mt-3">Drag & Drop</h3>
            <h3>Here</h3>
          </div>

          <div className=" Child GlassEffectFordiv d-none d-md-inline bg-waring  rounded-5 shadow mx-auto" style={{ color: isDark ? 'white' : 'darkgray', height: '400px', width: '450px' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver} >

            <img
              src={imageView}
              className="w-100 h-100 rounded-5  "

              style={{ position: 'absolute', left: '0px' }}
            />
            <input
              className=" border-none"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                left: '0px',

              }} />

            <i className=" mt-5"><FiDownloadCloud style={{ height: '120px', width: '120px', marginTop: '80px' }} /></i>
            <h3 className="mt-3">Drag & Drop</h3>
            <h3>Here</h3>
          </div>


          <div className="GlassEffectFordiv   rounded-5 Parent text-start shadow  mx-auto" >
            <div className=" p-3 w-100 text-end " >

              {loading && (
                <div className="m-auto  bg-successk" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, position: 'absolute' }}>
                  <Player className="bg-k " src='https://lottie.host/5a71c736-8150-4cf0-b870-7d97d992f1bc/y3KFjegVpO.json' loop autoplay style={{ height: '150px', width: '150px' }} />
                </div>
              )}
              <InputLabel className="mt-5 ms-0 ms-sm-0 ms-md-5 text-start">Default Address</InputLabel>
              {/* set ms-sm-0 for margin 0 on sm below screen size and ms dm - 5 for show margin after md screen size */}
              <TextField type='text' className="col-xl-11 col-12 ms-auto " onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Enter owner of nft address" required></TextField>


              <InputLabel className="mt-3 ms-sm-0 ms-md-5 text-start">Name</InputLabel>
              <TextField type='text' className=" col-xl-11 col-12" onChange={(e) => setNftName(e.target.value)} value={nftName} placeholder="Enter collection name" required></TextField>

              <InputLabel className="mt-3 ms-sm-0 ms-md-5 text-start ">External Url</InputLabel>
              <TextField type="url" disabled className=" col-xl-11 col-12" value='https://gateway.pinata.cloud/ipfs/cid' required></TextField>



              <InputLabel className="mt-3 ms-sm-0 ms-md-5 text-start ">Choose Type</InputLabel>
              <Select className=" col-xl-11 col-12 text-start" onChange={handleChange} value={type}>
                <MenuItem value="Art Collection">Art Collection</MenuItem>
                <MenuItem value="3D Collection">3D Collection</MenuItem>
                <MenuItem value="Animation Collection">Animation Collection</MenuItem>
              </Select>
          


            <InputLabel className="mt-3 ms-sm-0 ms-md-5 text-start ">Description</InputLabel>
            <TextField type="text" className=" col-xl-11 col-12" onChange={(e) => setDescription(e.target.value)} value={description} multiline rows={4} placeholder="Enter Description" required></TextField>
            <div className="text-end mb-4">
              <Button sx={{ borderRadius: '15px' }} className="mt-3 mb-4 " onClick={Minting} style={{ width: '150px' }} size="large" variant="contained" >Create</Button>
              {/* <Button sx={{borderRadius:'5px'}} className="mt-3 mb-4 " onClick={check} style={{ width: '150px' }} size="large" variant="contained" >getJwt</Button> */}

            </div>

          </div>



        </div>

    </div>

      </Container >
    </div >
  )
};

export default Nftminting;
