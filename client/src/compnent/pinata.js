import { Button, TextField } from "@mui/material";
import { PinataSDK } from "pinata-web3"
import React, { useState } from "react"

const UploadToIPFS = (props) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const Jwt = process.env.REACT_APP_PINATA_API_JWT;
  const pinata = new PinataSDK({
    pinataJwt: Jwt,
    pinataGateway: "https://gateway.pinata.cloud",
  });

  const Authentication = async () => {
    const auth = await pinata.testAuthentication()
    console.log('auth is:', auth)
  }

  const upload = async () => {
    console.log('file s', file, name, description)
    try {

      const upload = await pinata.upload.file(file) // Ensure upload works
      console.log('image', upload);

      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)

      console.log('ipfs url:', ipfsUrl)

      const metadata = pinata.upload.json({
        name: name,
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

      }).then((resp) => {
        setUrl(`https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`);
        console.log(`https://gateway.pinata.cloud/ipfs/${resp.IpfsHash}`)
      })





    } catch (error) {
      console.log("Error:", error);
    }
  }






  const getdata = async () => {
      const key =  process.env.REACT_APP_PINATA_API_JWT
      console.log(key)
      console.log('Private_key:', key ? 'Loaded' : 'Not Loaded');
  }

  return (
    <div>
      <Button variant="contained" onClick={Authentication}>Authentication</Button><br /><br />

      <input type='file' placeholder="" onChange={(e) => setFile(e.target.files[0])} /><br /><br />
      <TextField type="text" placeholder="Enter nft name" label='name' value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
      <TextField type="text" placeholder="Enter nft description" label='description' value={description} onChange={(e) => setDescription(e.target.value)} /><br /><br />

      <Button variant="contained" onClick={upload}>Upload</Button><br />

      <br />
      <Button variant="contained" onClick={getdata}>Get Data</Button>
    </div>
  )
};
export default UploadToIPFS;
