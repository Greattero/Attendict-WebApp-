import React, { useEffect, useRef, useState } from "react";

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

    <div  style={{
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
                Location pinned
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
    
    </div>
  )





  

}
