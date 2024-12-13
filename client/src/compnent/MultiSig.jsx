import React, { useContext, useState } from "react"
import { BlockchainContext } from "../Web3Connection/Connection";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Link, TextField } from "@mui/material";
import { Player } from "@lottiefiles/react-lottie-player";
import { Col, Container, Row } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router";
import { notify } from "./Notify";


const Multisig = (props) => {
  const { web, nftContract, dutchContract, engContract, multiContract, account } = useContext(BlockchainContext)

  const [owners, setOwners] = useState([]);
  const [confirmations, setConfirmations] = useState();
  const [loading, setLoading] = useState(false)

console.log('multi sig contract:',multiContract)

  const navigate = useNavigate();

  
  const handleOwnersInput = (e) => {
    const input = e.target.value;
    const ownersArray = input.split(',').map(addr => addr.trim());
    setOwners(ownersArray);
  };
  const MultiSigWallete = async () => {
    setLoading(true)
    try {
      const gas = await multiContract.methods.setOwners(owners, confirmations).estimateGas({ from: account });
      const result = await multiContract.methods.setOwners(owners, confirmations).send({ from: account, gas: gas });
      console.log('result', result)
      navigate('mulisignature-details')
      notify('success', "Successful", 'Wallet successfully created')
      console.log("multisig contract :",multiContract)
    } catch (error) {
      console.log('error', error)
      let errorMessage;
      if (error && error.data && error.data.data) {
        errorMessage = error.data.data.reason;
      } else if (error.message) {
        errorMessage = error.data.message;
      } else {
        errorMessage = 'Unexpected Error';
      }
      notify('error', 'Error', errorMessage)
    }finally{
      setLoading(false)
    }
   
  }

  return (
    <div className="mb-5">
      <Container className="mt-5">
        <Row xl={2} lg={2} md={2} sm={1} xs={1} className="mt-5">
          <Col className="">
            <Player className="w-75 h-75 mt-5" src='https://lottie.host/46ab3329-44ca-4b64-a246-978c4b229278/A6JyrLjO2D.json' loop autoplay style={{ height: '200px', width: '200px' }} />
          </Col>

          {loading && (
          <div className="m-auto  bg-successk" style={{top:'50%',left:'50%', transform: 'translate(-50%, -50%)', zIndex: 1, position: 'absolute'}}>
          <Player className="bg-k " src='https://lottie.host/5a71c736-8150-4cf0-b870-7d97d992f1bc/y3KFjegVpO.json' loop autoplay style={{height:'150px', width:'150px'}}/>
              </div>
          )}
          <Col className="mt-3">
          <h5 className="text-start">Create new wallet</h5>
            <Card className="p-0 m-0 rounded-4 shadow">
              <CardContent>
                {owners.length > 0 ? (
                  <ul className="p-0 m-0 listStyle text-secondary">
                    {owners.map((owner, index) => (
                      <li className="ellipsedText" key={index}>Owner {index + 1}: {owner}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="p-0 m-0 listStyle text-secondary">
                    <li className="ellipsedText">Owner 1: 0x0000000000000000000000000000000000000000</li>
                    <li className="ellipsedText">Owner 2: 0x0000000000000000000000000000000000000000</li>
                    <li className="ellipsedText">Owner 3: 0x0000000000000000000000000000000000000000</li>
                  </ul>
                )}

                {/* <Accordion className="mt-3" >
                  <AccordionSummary expandIcon={<MdExpandMore />}>
                  Transaction Details
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="listStyle">
                      <ul>
                        <li>Id: 5</li>
                        <li>To: 0x00000000000000000000000000000000000000</li>
                        <li>Value: 10 ETH </li>
                        <li>Confirmations: 2</li>
                        <li>Executed: true</li>
                      </ul>
                    </div>
                  </AccordionDetails>
                </Accordion> */}
              </CardContent>
            </Card>
            <div className="mt-5 p-3">
              <TextField className="w-100 ellipsedText " label='Owners' placeholder="Enter owners seprate with comma's" type="text" id="address" name="address" onChange={handleOwnersInput} required />
              <TextField className="w-100 mt-3 ellipsedText " label='Confirmations' placeholder="Enter confirmations number" type="number" id="number" name="number" onChange={(e) => setConfirmations(e.target.value)} required /> 
              
              <br /><br />
              <Button variant="contained" className="w-100 bg-info mt-2 rounded-3" size="large" onClick={MultiSigWallete} >Create new wallet</Button>
              <h5 className="mb-0 mt-3">or</h5>
              <hr />
              <Button variant="contained" className="w-100 bg-warning rounded-3" size="large"onClick={()=>navigate('mulisignature-details')} >Existing Wallet</Button>
              {/* <Button variant="contained" className="w-100" size="large" onClick={data} >Set data</Button> */}
            </div>
          </Col>
        </Row>

      </Container>

    </div>
  )
};

export default Multisig;
