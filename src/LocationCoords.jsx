import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LocationWrapper = styled.div`

  background-color: red;
  margin-top: 15px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 9999;
  box-shadow: 0.5px 0.5px 0.5px 0.5px grey;

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

    <LocationWrapper >

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
