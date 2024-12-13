import React, { useContext, useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { Alert, AlertTitle, Box, Button, Card, CardContent, colors, InputLabel, TextareaAutosize, TextField } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { themeContext } from "../Context/themeContext";
import { FiDownloadCloud } from "react-icons/fi";
import { borders } from '@mui/system';
import Boy from './images/Boy.jpg'
import { IoMdCart } from "react-icons/io";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { Alerts } from "./Notify";
const Practice = () => {
  const { isDark } = useContext(themeContext)

  const boxRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false); 
  const handleClick = () => { setShowAlert(true); };

  let array = [{ name: 'satnam', age: 22 }, { name: 'jassa', age: 29 }];

  let owners = ["0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1","0xD3dB62da34b02f95926199a9f959EE99f076394c","0x21F9720a12D72728B885acfD47AA213468655968"]
  let submited = "0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1";
  let confirmed = ["0xD3dB62da34b02f95926199a9f959EE99f076394c","0x21F9720a12D72728B885acfD47AA213468655968","0x545314C1E79589Ec2f97a454f67E61d3AeDF86d1"]
  let executed = "0xD3dB62da34b02f95926199a9f959EE99f076394c";

  const OnwerHandler = () => {
    for(let i = 0; i<= owners.length; i++){
      if(submited == owners[i] &&  owners[i] == confirmed[i] && owners[i] == executed ) {
          console.log("success")
      } else if(submited == owners[i] &&  owners[i] == confirmed[i]) {
          console.log("warning")
      } else if(submited == owners[i]) {
          console.log("info")
      }else{
        console.log('nothing')
      }
      
    }
  }

  let key = process.env.REACT_APP_API_KEY
  console.log('key', key)
  console.log('keys', process.env.REACT_APP_API_KEY);
 const toast = (Icon, Title) => {
    Swal.fire({
       icon: 'success',
       position:'top',
       title: "Item is successfully put up for sale",
       toast:true,
       timer:5000,
       showConfirmButton:false,
       iconColor:'white',
       color:'white',
      background:'#98FF98'
       
    })
   };

   const showAlerts  = async() => {
       toast()
   }

  return (
    <div className="text-center" >
      {showAlert &&(
 <Alert icon={<FaCheckCircle/>}  onClose={() => setShowAlert(false)} style={{backgroundColor:'#bcf5bc'}} className="w-25 mt-5 mx-auto text-start rounded-3 text-success">
 <AlertTitle>Success</AlertTitle>
  Successfuly sold out
 </Alert>
      )}
     <Button onClick={handleClick}>Alert</Button>
     <Button onClick={toast}>toast</Button><br />
     <Button onClick={showAlerts}>show Alert</Button>

      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img src={Boy} alt="Avatar" style={{ width: "300px", height: "300px" }} />
          </div>
          <div className="flip-card-back">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>



      </div>


      <div className="  shadow rounded-5 GlassEffect mx-auto " style={{ height: '330px', width: '280px', marginTop: '100px' }}>
        <div className="" style={{ height: '200px' }} >
          <img className="pt-2 pe-2 ps-2 rounded-5 w-100 h-100" src={Boy} alt="" />
        </div>
        <div className="" >
          <div className="mt-3  d-flex me-3 ms-3">
            fdgds
            <h6 className="text-end ms-auto">#: 3</h6>
          </div>

          <h5 className="text-start ms-3">30 ETH</h5>


          <p className="text-start mt-4 LastSale ms-3">Last Sale: 0.00 ETH</p>
          <div className="BuyButton mt-3 pt-2 rounded-bottom-5 w-100">
            <div className=" w-100  d-flex  text-white p-1">
              <h6 className="mx-auto ps-4">Buy</h6>
              <i className="text-end ms-auto pe-2"><IoMdCart /></i>
            </div>
          </div>
        </div>

      </div>

      <div className="">
        {array.map((item, i) => (
          <div className="d-flex">
            <h5>name:{item.name} & age: {item.age}</h5>
          </div>
        ))}
      </div>


      <div className="">

      {owners.map((owner,index)=>(
       <div className="">
         {/* <p className={submited === owner? 'text-info':''}  key={index}>owner {index+1}: {owner}</p> */}
         {/* <p key={index} className={confirmed[index] === owner? 'text-warning':'text-info'}>confirmed: {confirmed[index]}</p> */}

         {submited == owner && confirmed[index] == owner && executed == owner?
         <p className="text-success">owner: {owner}</p>
        :
        <p>NOt success</p>}
       </div>
      ))}
      </div>

      <Button variant= 'contained' onClick={OnwerHandler}>owners</Button>
    </div>
  );
};

export default Practice;
