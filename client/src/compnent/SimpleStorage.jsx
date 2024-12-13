import React, { useContext, useEffect, useState } from "react"
import { BlockchainContext } from "../Web3Connection/Connection";
import { Button } from "@mui/material";

const Simple = (props) => {
    const { web, nftContract,nftContAddress, simple, dutchContract, dutchAddress, engContract, multiContract, account  } = useContext(BlockchainContext)
    const [value, setValue] = useState();
    const [amount, setAmount] = useState(9999);

    const getValue = async() => {
        try {
            const result = await simple.methods.read().call();
            setValue(result.toString())
            console.log('simple storage result',result)
        } catch (error) {
            console.log('error fomr simple',error)
        }
    }
    const WriteValue = async() => {
        try {
            const gas = await simple.methods.write(amount).estimateGas({from: account});
            const result = await simple.methods.write(amount).send({from: account, gas: gas});
            console.log('simple storage result',result)
        } catch (error) {
            console.log('error fomr simple',error)
        }
    }
  useEffect(()=>{
      getValue()
  },[simple]);
    return (
    <div>
      <h5>Hi This is from Simple</h5>
      <h5>Value: {value}</h5>
      <Button variant="" onClick={getValue}> Value</Button>
      <Button variant="contained" onClick={WriteValue}>Write</Button>

    </div>
  )
};

export default Simple;
