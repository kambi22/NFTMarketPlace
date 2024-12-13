
import React, { useContext, useEffect, useState } from "react"
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import { Button, IconButton, Switch } from "@mui/material";
import { themeContext } from "../Context/themeContext";
import { MdLightMode, MdDarkMode, MdMenu } from "react-icons/md";
import Sidebar from "./Sidebar";
import white from './images/react192.png'
import gold from './images/gold.png'
import { BlockchainContext } from "../Web3Connection/Connection";
import Aos from 'aos'
import 'aos/dist/aos.css';
const Header = (props) => {
  const { FetchData } = useContext(BlockchainContext)
  const { isDark, toggleTheme } = useContext(themeContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
      Aos.init({
        duration:2000
      })
  },[]);

 
  const SidebarHandler = () => {
    setOpen(!open)
  }

  return (
    <div className="sticky-top">

<Navbar className={!isDark ? 'ColoredLight ' : 'ColoredDark'} expand='md' sticky="top" style={{ height: '70px' }} >
 <Container  >
          <Sidebar open={open} close={SidebarHandler} />
          <div className="me-auto d-flex">
            <IconButton className="d-inline d-sm-none" onClick={SidebarHandler}>
              <MdMenu />
            </IconButton>
            <Navbar.Brand className="" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              {/* <img src="react192.png" className="me-1" alt="logo" style={{height:'30px'}} /> */}
              <img src={white} className={!isDark ? 'd-inline' : 'd-none'} alt="logo" style={{ height: '30px' }} />
              {/* <img src="darkblue.png" className={!isDark ? 'd-inline' : 'd-none'}  alt='logo' style={{height:'30px'}} /> */}
              <img src={gold} className={isDark ? 'd-inline' : 'd-none'} alt="logo" style={{ height: '30px' }} />
              <strong data-aos="fade-right" className={!isDark ? 'ColoredLight' : 'ColoredDark'}>Softwork</strong>
            </Navbar.Brand>
          </div>
          <Nav className="">
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline ' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/')}>Home</Nav.Link>
           
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/nftminting')}>Minting</Nav.Link>
            {/* <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/nftbuy')}>Buy</Nav.Link> */}
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/nftselling')}>Sell</Nav.Link>
            <div  className={!isDark ? 'dropdown mt-2 d-none d-md-inline' : 'dropdown mt-2 d-none d-md-inline'} >
              <span>Auctions</span>
              <div className={isDark? 'dropdown-content text-light bg-dark rounded-3 pt-2 pb-2 shadow':'dropdown-content m-2 text-dark bg-light shadow pt-2 pb-2 rounded-3'}>
                <Nav.Link className={isDark? 'text-light shadowEffectDark':'text-dark shadowEffectLight'} onClick={() => navigate('/auction-english')}>English Auction</Nav.Link>
                <Nav.Link className={isDark? 'text-light shadowEffectDark':'text-dark shadowEffectLight'} onClick={() => navigate('/auction-dutch')}>Dutch Auction</Nav.Link>
              </div>
            </div>
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline ms-2' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/multisignature-wallet')}>Multisig-Wallet</Nav.Link>
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/login')}>Login</Nav.Link>
            <Nav.Link className={!isDark ? 'ColoredLight d-none d-md-inline' : 'ColoredDark d-none d-md-inline'} onClick={() => navigate('/practice')}>Practice</Nav.Link>
          </Nav>
          <Nav className="" >

            <IconButton className={!isDark ? 'd-inline' : 'd-none'} onClick={toggleTheme} >
              <p className={!isDark ? 'd-inline h6 me-1' : 'd-none'}>Light</p>
              <MdLightMode />
            </IconButton>
            <IconButton className={isDark ? 'd-inline' : 'd-none'} onClick={toggleTheme}>
              <p className={isDark ? 'd-inline h6 me-1' : 'd-none'}>Dark</p>
              <MdDarkMode />
            </IconButton>
            {/* <Button   className={!isDark ? 'mt-2 shadow rounded-2 d-none d-md-inline' : 'mt-2 shadow rounded-2 d-none d-md-inline'} variant="" style={{ height: '40px',position:'' }} onClick={() => ConnectWallet()}>Connect</Button> */}
          </Nav>
        </Container>



      </Navbar>

    </div>
  )
};

export default Header;
