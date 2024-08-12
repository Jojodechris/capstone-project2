// EachReview.js
import React, { useEffect, useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import{faTrash} from '@fortawesome/free-solid-svg-icons'
import Review from './Review';



function EachReview({review}){
     
    return(
        <div>
            <div className="card">
            <div className="cardHeader">
                <span className="rating">
                    {/* {review.rating} */}
                </span>
                <span className="icon" >
                <FontAwesomeIcon icon={faTrash}/>
                </span>
            </div>
            <div className="comment">
               {review.comment}
        </div>
        </div>
        </div>
    )
}
export  default EachReview;
