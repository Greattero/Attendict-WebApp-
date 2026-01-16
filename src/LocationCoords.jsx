import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import 'boxicons/css/boxicons.min.css';


const LocationWrapper = styled.div`
  margin-top: 95px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(141, 138, 138, 1);
  border-radius: 50px;
  padding: 5px;
  padding-left: 15px;
  padding-right: 20px;

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
          <div style={{
          paddingBottom: "5px",
          }}>
            <i className="bx bxs-circle" style={{ color: "green", fontSize: "10px" }} />
          </div>              
              Location pinned
            </label>
        ) : 
        (<label style={{
                fontWeight:"bold"
            }}>
            {/* <Octicons name="dot-fill" size={15} color="grey" 
            style={{marginTop:5}}
            /> */}
          <div style={{
          paddingBottom: "5px",
          }}>
            <i className="bx bxs-circle" style={{ color: "grey", fontSize: "10px" }} />
          </div>

          Still fetching location...
            
        </label>)
        }
    
    </LocationWrapper>
  )





  

}
