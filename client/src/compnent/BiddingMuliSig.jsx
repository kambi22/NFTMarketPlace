import React, { useContext, useEffect, useState } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Button, Card, CardContent, Paper, TextField } from '@mui/material'
import { useNavigate } from "react-router";
import { BlockchainContext } from "../Web3Connection/Connection";
import { notify } from "./Notify";
import { setLengthLeft } from "web3-eth-accounts";
import { Player } from "@lottiefiles/react-lottie-player";
const DetailMultiSig = (props) => {
    const { web, nftContract, dutchContract, engContract, multiContract, account } = useContext(BlockchainContext)
    const [sendTo, setSendTo] = useState();
    const [id, setId] = useState();
    const [amount, setAmount] = useState();
    const [isConfirm, setIsConfirm] = useState(false);
    const [isExecuted, setIsExecuted] = useState(false);
    const [Owners, setOwners] = useState([]);
    const [confirmedFrom, setConfirmedFrom] = useState();
    const [allConfirmed, setAllConfirmed] = useState([]);
    const [executedFrom, setExecutedFrom] = useState();
    const [submitedFrom, setSubmitedFrom] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Submit = async () => {
        setLoading(true)
        console.log("caller")
        console.log('id', id)
        console.log('to', sendTo)
        console.log('amount', amount)

    }

    const fetchOwners = async () => {
        setLoading(true)
        try {
            const ownerList = await multiContract.methods.getOwners().call();
            console.log('owner is:', ownerList)
            setOwners(ownerList);
        } catch (error) {
            console.error("Error fetching owners:", error.message);

        } finally {
            setLoading(false)
        }
    };
    const resentWallet = async () => {
        setLoading(true)
        try {
            const gas = await multiContract.methods.resetwallet().estimateGas({ from: account })
            const result = await multiContract.methods.resetwallet().send({ from: account, gas: gas });
            console.log('owners reset', result)
            navigate('/multisignature-wallet')
            notify('success', 'Successful', 'Wallet successfully reset')

        } catch (error) {
            console.error("Error reset owners:", error.message);
            notify('error', 'Error', 'Unexpected error to reset')


        } finally {
            setLoading(false)
        }
    };

    const submitTx = async () => {
        setLoading(true)
        try {
            const gas = await multiContract.methods.submit(sendTo, id).estimateGas({ from: account, value: web.utils.toWei(amount, 'ether') })
            const result = await multiContract.methods.submit(sendTo, id).send({ from: account, gas: gas, value: web.utils.toWei(amount, 'ether') });
            console.log('submit transaction', result)
            fetchOwners();
            setSubmitedFrom(result.from)
            console.log('submited from', result.from)
            notify('success', 'Successful', 'Transaction successfully submited')

        } catch (error) {
            let errorMessage;
            if (error && error.data && error.data.message) {
                errorMessage = error.data.message
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
    const ConfirmTx = async () => {
        setLoading(true)
        try {
            const gas = await multiContract.methods.ConfirmTx(id).estimateGas({ from: account })
            const result = await multiContract.methods.ConfirmTx(id).send({ from: account, gas: gas })
            console.log('submit transaction', result)
            console.log('submit transaction', result)
            console.log('submit transaction', result.from)
            fetchOwners();
            setAllConfirmed(prevState => [...prevState, result.from.toLowerCase()]);

            console.log('all confirmed', allConfirmed);
            setConfirmedFrom(result.from.toLowerCase());
            notify('success', 'Successful', 'Transaction successfully confirmed')

            // for (let i = 0; i <Owners.length; i++) {
            //     const owner =Owners[i];
            //     if (result.from === owner) {
            //         let index = i;
            //         console('this owner confirmed',owner)
            //         confirmedFrom(owner)
            //     }
            // }
        } catch (error) {
            console.log('error messge',error.data.message)

            let errorMessage;
            if (error && error.data && error.data.message) {
                errorMessage = error.data.message
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
    const ExecutedTX = async () => {
        setLoading(true)
        try {
            const gas = await multiContract.methods.Executed(id).estimateGas({ from: account })
            const result = await multiContract.methods.Executed(id).send({ from: account, gas: gas });
            console.log('submit transaction', result)
            fetchOwners();

            notify('success', 'Successful', 'Transaction successfully executed')
            setExecutedFrom(result.from)
        } catch (error) {
            let errorMessage;
            if (error && error.data && error.data.message) {
                errorMessage = error.data.message
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unexpected Error";
            }
            notify('error', 'Error', errorMessage)
        } finally { setLoading(false) }
    }

    // Call fetchOwners at an appropriate time, like in a useEffect hook
    useEffect(() => {
        fetchOwners();
    }, [multiContract]);

    return (
        <div className=" mb-5 pt-5">

            <Container className="mt-5">
                <Card className=" MuliColorCard rounded-5 shadow" >

                    <Row xl={2} lg={2} md={1} sm={1} xs={1} className="p-5" >
                        <Col className="mb-3">
                            <h5 className='text-start'>Auction Details</h5>
                            <Card className="ModernCard shadow rounded-4">
                                <CardContent>
                                    {sendTo ? (
                                        <ul className="listStyle m-0  ">
                                            <li className="ellipsedText">To: {sendTo}</li>
                                            <li className="ellipsedText">Token Id: {id}</li>
                                            <li className="ellipsedText">Value: {amount} ETH</li>
                                        </ul>
                                    ) : (
                                        <ul className="listStyle m-0  ">
                                            <li className="ellipsedText">To: 0x00000000000000000000000000000000000000000000</li>
                                            <li className="ellipsedText"> Token Id: 0</li>
                                            <li className="ellipsedText">Value: 0.0 ETH</li>
                                        </ul>
                                    )}

                                </CardContent>
                            </Card>
                        </Col>

                        <Col>
                            <h5 className="text-start">Wallet Owners</h5>
                            <Card className="ModernCard shadow rounded-4">
                                <CardContent>
                                    {Owners.length > 0 ? (
                                        <ul className="p-0 m-0 listStyle">
                                            {Owners.map((owner, index) => (
                                                <li
                                                    className={

                                                        confirmedFrom?.toLowerCase() === Owners[index]?.toLowerCase()
                                                            ? executedFrom?.toLowerCase() === Owners[index]?.toLowerCase()
                                                                ? 'text-success'
                                                                : 'text-warning'
                                                            : allConfirmed.includes(Owners[index]?.toLowerCase())
                                                                ? 'text-warning'
                                                                : executedFrom?.toLowerCase() === Owners[index]?.toLowerCase()
                                                                    ? 'text-success'
                                                                    : ''

                                                    }
                                                    key={index}
                                                >
                                                    Owner: {index + 1} {owner}
                                                </li>


                                            ))}
                                        </ul>
                                    ) : (
                                        <ul className="p-0 m-0 listStyle">
                                            <li >
                                                Owner1: 0x00000000000000000000000000000000000000
                                            </li>
                                            <li >
                                                Owner2: 0x00000000000000000000000000000000000000
                                            </li>
                                            <li >
                                                Owner3: 0x00000000000000000000000000000000000000
                                            </li>

                                        </ul>
                                    )}


                                </CardContent>
                            </Card>
                        </Col>
                    </Row>
                   
                    <CardContent>
                    {loading && (
                        <div className="m-auto  bg-successk" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, position: 'absolute' }}>
                            <Player className="bg-k  " src='https://lottie.host/5a71c736-8150-4cf0-b870-7d97d992f1bc/y3KFjegVpO.json' loop autoplay style={{ height: '150px', width: '150px' }} />
                        </div>
                    )}
                        <div className="Cardstyle  mt-5 mb-5 ">
                            <TextField className="w-100 ellipsedText rounded-3" label='To' placeholder="Enter address to  transaction" type="address" id="address" name="address" onChange={(e) => setSendTo(e.target.value)} required />

                            <TextField className="w-100 mt-3 ellipsedText rounded-3" label='Id' placeholder="Enter transaction id  " type="number" id="id" name="id" onChange={(e) => setId(e.target.value)} required />

                            <TextField className="w-100 mt-3 ellipsedText rounded-3" label='Amount' placeholder="Enter bid amount" type="number" id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            <br /><br />
                            <div className="d-flex justify-content-between mt-3">
                                <Button className="bg-info w-100 me-2 rounded-3" variant="contained" onClick={submitTx}>Submit</Button>
                                {/* <Button className="bg-warning w-100 ms-1 me-1" variant="contained" onClick={Confirm}>Confirm</Button>
                                <Button className="bg-secondary w-100" variant="contained" onClick={Executed}>Executed</Button> */}
                                <Button className="bg-warning w-100 me-2 rounded-3" variant="contained" onClick={ConfirmTx}>Confirm</Button>
                                <Button className="bg-success w-100 rounded-3" variant="contained" onClick={ExecutedTX}>Executed</Button>
                            </div>
                            <Button className="bg-secondary w-100 mt-3 rounded-3" variant="contained" onClick={resentWallet}>Reset wallet</Button>

                        </div>
                    </CardContent>
                </Card>
            </Container>

        </div>
    )
};

export default DetailMultiSig;
