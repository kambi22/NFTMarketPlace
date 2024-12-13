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
                        const address = '0x44A6D408526aD5942300D36009c802A450a6f70C'//holesky
                        const contract = new web.eth.Contract(abi, address)
                        setMultiContract(contract)

                    } catch (error) {
                        console.log("Error min Multi-sig wallet", error)
                    }
                }

                const EnglishAuction = async () => {
                    try {
                        const abi = EnglishAbi.abi;
                        const address = '0x652275DA59f3a1fbb190Bf151FB510D8290DE191'//ganache
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
                        const address = '0x38331d64F82775FA707463Ae95f11ead6010E274'//ganache
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
                        const address = '0x0B18125eCbFEeA4B453BB824526379cEFc4bed43'//ganache
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
                        const address = '0x3c05a56879CF0a2D6C7ac9068F8f233862220d42'//ganache
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
