import { Button, Fab, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useContext, useState } from "react"
// import {  Visibility,VisibilityOff } from "@mui/icons-material";
import { MdVisibility, MdVisibilityOff  } from "react-icons/md";
import { Player } from "@lottiefiles/react-lottie-player";
import Swal from 'sweetalert2'
import {notify, toast} from "./Notify";
import icon from './icon.json'
import softwork from './images/Softwork.png'
import { themeContext } from "../Context/themeContext";
const Login = (props) => {
  const { isDark, toggleTheme } = useContext(themeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowpassword] = useState(false);
  const [buttonColor, setButtonColor] = useState(false);

  const LoginButton = async() => {

    console.log('result',email, password)
     if(email !== '' && password !== '') {
      setButtonColor(true)
      notify("success","Success","Login Successfull 🎉")

     } else {
      notify("error","Error","please Enter Vailed Credentials")
      
     }
    }

 

  return (
    <div className={isDark? 'backgroundDark pt-5 d-flex justify-content-center':'backgroundLight pt-5 d-flex justify-content-center'} style={{paddingBottom:'200px'}}>


      <div className="GlassEffect ms-2 me-2 pt-5 shadow rounded-5 p-3">  {/*go to css file using crt+click on class name; */}
      <h5 className={isDark? 'text-light ':'text-dark t'}>Login</h5>
     
      <Player className="" src='https://lottie.host/28489f37-c5b8-4d46-99ec-28f5482d24fa/LcLSzjK909.json' loop autoplay style={{height:'200px',width:'200px'}}/>
        <TextField className="w-100" type='email' label='Email' placeholder="Enter User Email" id="email" name="email" autoComplete="email" autoCorrect="email" required onChange={(e)=>setEmail(e.target.value)}/>
        <TextField className="w-100 mt-3" type={showpassword ? "text":"password"} label='Password'  placeholder="Enter User Pssword" id="password" name="password" autoComplete="password" autoCorrect="password" required onChange={(e)=>setPassword(e.target.value)} InputProps={{
          endAdornment: (
            <InputAdornment position="end">
           <IconButton className={showpassword? 'd-inline':'d-none'} onClick={()=>setShowpassword(false)}>
              <MdVisibility/>
           </IconButton>
           <IconButton className={!showpassword? 'd-inline':'d-none'} onClick={()=>setShowpassword(true)}>
              <MdVisibilityOff/>
           </IconButton>
           </InputAdornment>
          )
        }}/>

        <Button  className="mt-5 w-100 mb-5 bg-  rounded-3"  style={{height:'40px'}} variant='contained'   size="large" onClick={LoginButton}>Login</Button>
      </div>

      
    </div>
  )
};

export default Login;
