import React, { createContext, useEffect, useState } from "react"
import Web3 from 'web3'
import MultiAbi from '../contracts/Multisig.json';
import DutchAbi from '../contracts/DutchAuction.json'
import EnglishAbi from '../contracts/EnglishAuction.json'
import MynftAbi from '../contracts/MyNFT.json';
import StorageAbi from '../contracts/Storage.json';
import Routting from "../compnent/Routing";


export const BlockchainContext = createContext();
const Connection = (props) => {
    const [web, setWeb] = useState();
    const [multiContract, setMultiContract] = useState();
    const [engContract, setEngContract] = useState();
    const [engAddress, setEngAddress] = useState();
    const [nftContract, setnftContract] = useState();
    const [dutchContract, setDutchContract] = useState();
    const [account, setAccount] = useState();
    const [dutchAddress, setDutchAddress] = useState();
    const [nftContAddress, setNftContAddress] = useState();
    const [simple, setSimple] = useState();
    const [storageContract, setStorageContract] = useState();

    const FetchData = async () => {
        if (window.ethereum) {
            try {
                const web = new Web3(window.ethereum);
                setWeb(web)
    
                await window.ethereum.request({ method: 'eth_requestAccounts' })

                const accounts = await web.eth.getAccounts();
                console.log('accounts', accounts[0])
                setAccount(accounts[0])

                window.ethereum.on('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                })


                const MultiSigWallet = async () => {
                    try {
                        const abi = MultiAbi.abi
                        const address = '0x9f194bbd3cad690a31ef8d4a0062354eabdc49f7'//holesky
                        const contract = new web.eth.Contract(abi, address)
                        setMultiContract(contract)

                    } catch (error) {
                        console.log("Error min Multi-sig wallet", error)
                    }
                }

                const EnglishAuction = async () => {
                    try {
                        const abi = EnglishAbi.abi;
                        const address = '0x99f56b7f65cd7fbb1ec3a018acee1ebd57ae56fb'//holesky
                        setEngAddress(address)
                        const contract = new web.eth.Contract(abi, address)
                        
                        setEngContract(contract)

                    } catch (error) {
                        console.log("Error in english auctin contract", error)
                    }
                }
                const DutchAuction = async () => {
                    try {
                        const abi = DutchAbi.abi;
                        const address = '0x56d69268faa84b8468d1f6404ee492fa588ed252'//holesky
                        setDutchAddress(address)
                        console.log(address)
                        const contract = new web.eth.Contract(abi, address)
                        console.log("contract:",contract)
                        setDutchContract(contract)

                    } catch (error) {
                        console.log("Error in dutch auctin contract", error)
                    }
                }
                const NftMinting = async () => {
                    try {
                        const abi = MynftAbi.abi;
                        const address = '0x09fd68885b087344ebddcfc4c627191228b38923'//holesky
                        // const address = '0xb68F8588a9B7A2E49054dBFc618bcA9f9A85Ef0A'//ganache
                        setNftContAddress(address)
                        const contract = new web.eth.Contract(abi, address)

                        setnftContract(contract)

                    } catch (error) {
                        console.log("Error in english auctin contract", error)
                    }
                }
                const Storage = async () => {
                    try {
                        const abi = StorageAbi.abi;
                        const address = '0x86e6b3d0122543df93087e20dc6675536cbda8c4'//holesky
                        // const address = '0x1B9C97117893267beEA3C9f3B8F9AC289AD828d5'//ganache
                        console.log('abi ',abi)
                        console.log('address ',address)
                        const contract = new web.eth.Contract(abi, address)
                       
                        setStorageContract(contract)

                    } catch (error) {
                        console.log("Error in english auctin contract", error)
                    }
                }
                Storage();
                MultiSigWallet()
                EnglishAuction()
                DutchAuction();
                NftMinting()

            } catch (error) {
                console.log('Error fetch data from blockchain.')
            }
        } else {
            console.log("Please install vailed provider like Metamask");
        }
    }
    useEffect(() => {
        FetchData();
    }, []);
    return (
        <BlockchainContext.Provider value={{web, nftContract,engAddress, nftContAddress, simple, dutchContract, dutchAddress, engContract, multiContract, account, storageContract }}>
        <Routting/>
        </BlockchainContext.Provider>
    )
};

export default Connection;
