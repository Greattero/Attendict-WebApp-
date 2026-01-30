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
  if (!navigator.geolocation) {
    console.log("Geolocation not supported");
    return;
  }

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      setStat("Fetching location..");

      if (pos.coords.accuracy <= 7) {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setLocation(coords);
        locationValues(coords);
        setStat("Location pinned");
        alert(`Location pinned (${pos.coords.accuracy.toFixed(1)} m)`);

        // stop watching once accurate
        navigator.geolocation.clearWatch(watchId);
      } else {
        setStat(`Inaccurate location (${pos.coords.accuracy.toFixed(1)} m). Still fetching`);

      }
    },
    (err) => {
      if (err.code === 1) alert("Turn on location or allow permissions, then refresh page.");
      if (err.code === 2) alert("Position unavailable. Refresh page and try again");
      if (err.code === 3) alert("Timeout. Refresh page and try again");
    },
    { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, []);


  return(

    <LocationWrapper >

<label style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
  <i className="bx bxs-circle" style={{ color: location ? "green" : "grey", fontSize: "15px" }} />
  {location ? `Location pinned`: stat}
</label>
      
    
    </LocationWrapper>
  )





  

}
