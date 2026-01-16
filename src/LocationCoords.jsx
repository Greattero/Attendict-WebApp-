import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LocationWrapper = styled.div`
  display: flex; 
      
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    position: absolute;
    top: 0;
    bottom: 10;
    // margin-bottom: 3rem; /* NOT huge */
    // margin-top: 10px;
    background-color: red;
  }

`;

export default function LocationCoords({locationValues}){

  const [location, setLocation] = useState(null);
  const [stat, setStat] = useState(null);
  
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setStat(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          console.log("Permission denied");
        } 
        // else if (err.code === err.POSITION_UNAVAILABLE) {
        //   console.log("Location services off");
        // } else if (err.code === err.TIMEOUT) {
        //   console.log("Location request timed out");
        // }
      }
    );
}, []);

  return(

    <LocationWrapper  style={{
            // backgroundColor:"rgba(136, 147, 91, 1)",
            padding: 5,
            paddingLeft: 15,
            paddingRight:20,
            borderRadius: 40,
            borderWidth: 2,
            borderColor:"rgba(141, 138, 138, 1)"}}>

        {location ? (
            <label style={{
                fontWeight:"bold"
            }}>
                {/* Lat: {coords.latitude}{"\n"}
                Lon: {coords.longitude} */}
                {/* <Octicons name="dot-fill" size={15} color="green" 
                style={{marginTop:5}}
                /> */}
              {`Location pinned  ${location.lat}, ${location.lon} `}
            </label>
        ) : 
        (<label style={{
                fontWeight:"bold"
            }}>
            {/* <Octicons name="dot-fill" size={15} color="grey" 
            style={{marginTop:5}}
            /> */}
          Still fetching location...
            
        </label>)
        }
    
    </LocationWrapper>
  )





  

}
