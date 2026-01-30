import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import 'boxicons/css/boxicons.min.css';


const LocationWrapper = styled.div`
  margin-top: 75px;
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
  const [stat, setStat] = useState("Fetching location..");
  
useEffect(() => {
  if (!navigator.geolocation) return;

  let watchId = null;
  let retryInterval = null;

  const startWatch = () => {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy <= 10) {
          const coords = {
            lat: pos.coords.latitude.toFixed(5),
            lon: pos.coords.longitude.toFixed(5)
          };
          setLocation(coords);
          locationValues(coords);
          setStat("Location pinned");

          if (watchId) navigator.geolocation.clearWatch(watchId);
          if (retryInterval) clearInterval(retryInterval);
        } else {
          setStat(`Inaccurate location (${pos.coords.accuracy.toFixed(1)} m). Still fetching`);
        }
      },
      (err) => {
        if (err.code === 1) alert("Turn on location or allow permissions, then refresh page.");
        //if (err.code === 2) alert("Position unavailable. Refresh page and try again");
        if (err.code === 3) alert("Timeout. Refresh page and try again");
        // retry every 3s if error
      },
      { enableHighAccuracy: true, timeout: 120000, maximumAge: 0 }
    );
  };

  startWatch();

  // Retry every 3s if location not pinned yet
  retryInterval = setInterval(() => {
    if (!location) startWatch();
  }, 3000);

  return () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (retryInterval) clearInterval(retryInterval);
  };
}, []);



  return(

    <LocationWrapper >

<label style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
  <i className="bx bxs-circle" style={{ color: location ? "green" : "grey", fontSize: "15px" }} />
  {location ? `${location.lon}, ${location.lat}`: stat}
</label>
      
    
    </LocationWrapper>
  )





  

}
