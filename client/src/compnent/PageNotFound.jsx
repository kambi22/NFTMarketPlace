import { Player } from "@lottiefiles/react-lottie-player";
import React from "react"

const PageNotFound = (props) => {
  return (
    <div className="" style={{ marginBottom: '200px' }}>
      <Player src="https://lottie.host/6c65985b-52e2-4d16-9203-8b7ddc36290d/ZS1FkEWTK5.json" style={{ height: '300px', width: '300px' }} autoplay loop />
      <h3 className="text-muted fw-bold">Oop's Page Not Found!</h3>
    </div>
  )
};

export default PageNotFound;
