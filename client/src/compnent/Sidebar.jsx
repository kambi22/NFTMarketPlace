
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useContext, useEffect } from "react"
import { useTheme } from '@mui/material/styles';
import { MdDarkMode, MdHome, MdLightMode, MdSell, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router";
import { themeContext } from "../Context/themeContext";
import { RiAuctionFill, RiAuctionLine } from "react-icons/ri";
import { FaCartPlus } from "react-icons/fa6";
import { IoImages, IoLanguage, IoLogIn, IoWallet } from "react-icons/io5";
import Aos from "aos";
import 'aos/dist/aos.css';
const Sidebar = ({ open, close }) => {
  const { isDark, toggleTheme } = useContext(themeContext)
  const navigate = useNavigate();

  useEffect(()=>{
      Aos.init({
        duration:2000
      })
  },[]);

  return (
    <div className="">

      <Drawer className="d-sm-none d-block " style={{width:'300px'}} anchor="left" open={open} onClose={close}>
        <div className={isDark ? 'MySidebar h-100 bg-dark' : 'MySidebar h-100 bg-light'} >
          <ListItemButton  className="p-3 w-100 shadowEffect" onClick={() => navigate('/')} data-aos='fade-right'>
            <ListItemIcon>
              <MdHome size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItemButton>
          <hr className="mt-0" />
          
          <ListItemButton onClick={() => navigate('/nftminting')} data-aos='fade-right'>
            <ListItemIcon>
              <IoImages size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Create NFTs' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/nftselling')} data-aos='fade-right'>
            <ListItemIcon>
              <MdSell size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Sell NFTs' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/nftbuy')} data-aos='fade-right'>
            <ListItemIcon>
              <FaCartPlus size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Buy NFTs' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/auction-english')} data-aos='fade-right'>
            <ListItemIcon>
              <RiAuctionFill size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='English Auction' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/auction-dutch')} data-aos='fade-right'>
            <ListItemIcon>
              <RiAuctionLine size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Dutch Auction' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/multisignature-wallet')} data-aos='fade-right'>
            <ListItemIcon>
              <IoWallet size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='MultiSig Wallet' />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/login')} data-aos='fade-right'>
            <ListItemIcon>
              <IoLogIn size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Login' />
          </ListItemButton>
          <hr />
          {!isDark ? (
            <ListItemButton onClick={toggleTheme} data-aos='fade-right'>
              <ListItemIcon>
                <MdDarkMode size={24} /> {/* Increase size to 24px */}
              </ListItemIcon>
              <ListItemText primary='Dark mode' />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={toggleTheme} data-aos='fade-right'>
              <ListItemIcon>
                <MdLightMode size={24} /> {/* Increase size to 24px */}
              </ListItemIcon>
              <ListItemText primary='Light mode' />
            </ListItemButton>
          )}


          <ListItemButton data-aos='fade-right'>
            <ListItemIcon>
              <IoLanguage size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Language' />
          </ListItemButton>
          <ListItemButton data-aos='fade-right'>
            <ListItemIcon>
              <MdSettings size={24} /> {/* Increase size to 24px */}
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItemButton>
        </div>
      </Drawer>

    </div >
  )
};

export default Sidebar;
