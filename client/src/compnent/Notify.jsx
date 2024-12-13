import { Alert, AlertTitle } from "@mui/material";
import React from "react"
import Swal from "sweetalert2";
import { FaCheckCircle, FaEthereum, FaRegClock } from "react-icons/fa";

export const notify = (Icon, Title, Text) => {
   Swal.fire({
      icon: Icon,
      title: Title,
      text: Text,
      timer: 5000,
      showConfirmButton: false
   })
};
export const notifyconfirm = (Icon, Title, Text, Bool) => {
   Swal.fire({
      icon: Icon,
      title: Title,
      text: Text,
      showConfirmButton: Bool
   })
};
export const toast = (Icon, Title) => {
   Swal.fire({
      icon: Icon,
      position: 'top',
      title: Title,
      toast: true,
      timer: 5000,
      showConfirmButton: false,
      iconColor: 'white',
      color: 'white',
      background: '#98FF98'
   })
};

export const Alerts = (status, message) => {
   <div className="   col-xl-3 col-sm-10 col-xs-10 mt-3   mx-auto rounded-3 text-succes ">
      <Alert className="col-xl-3 col-sm-10 col-xs-10 mt-3 m-2 text-start rounded-3 text-success" data-aos="fade-down" icon={<FaCheckCircle />} style={{ backgroundColor: '#bcf5bc', zIndex: 1, position: 'absolute' }} >
         <AlertTitle>{status}</AlertTitle>
         {message}
      </Alert>
   </div>
}

