import { Skeleton } from "@mui/material";
import React from "react"

const LoadingCard = (props) => {
    return (
        <div>
            <div className="w-100" >
                <div className="" style={{ height: '300px' }} >
                    <Skeleton animation='wave' className="w-100 h-100 rounded-5"></Skeleton>
                </div>
                <div className="  d-flex me-3 ms-3">
                    <Skeleton animation='wave' className="w-50" height={30}></Skeleton>

                    <Skeleton animation='wave' className="ms-auto" width={30} height={30}></Skeleton>
                </div>
                <Skeleton animation='wave' className="ms-3" width={40} height={40} />
                <Skeleton animation='wave' className="m-3 w-50" height={30} />
            </div>
        </div>
    )
};

export default LoadingCard;
