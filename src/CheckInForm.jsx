import styled from "styled-components";
import React, { useEffect, useRef, useState } from 'react';
import loader from './assets/rolling.svg';


const Checkin = styled.div`
  border: none;
  position: fixed;
  top:50%;
  left:50%;
  width: 25rem;
  height: auto;
  border-radius: 5px;
  background-color:white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translate(-50%, -50%);
  z-index: 1001; /* Higher than overlay */
  @media screen and (max-width: 650px) {
    position: absolute;
    width: 70%;
    height: auto;

}
  
`;

const Input = styled.input`
  width: 95%;
  height: 35px;
  padding: 0.5rem;
  border-radius: 5px;
  border: 2px solid rgba(82, 237, 221, 0.14);
  background-color: rgb(243, 243, 243);
`;

const Select1 = styled.select`
    border-radius: 4px;
    background-color: white;
    width: 10rem;
    height: 2rem;
  }
`;

const Button = styled.button`
    width: 13rem;
    height: 2rem;
    margin-left: 100px;
    margin-top: 20px;
    padding: 25px;
    border: none;
    background-color: seagreen;
    color: white;
    font-size: 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.25s ease;

    &:hover{
    background-color: #276c47;
    }

    display: flex;
    align-items: center;
    justify-content: center;
  
        @media screen and (max-width: 650px) {
        width: 70%;
        height: 8px;
        margin-left: 40px;


    }
`;

const Header = styled.label`
  text-align: center;
  font-weight: bold;
  font-family: Arial, san-serif;
  color: green;
  font-size: 30px;
  margin-top: -10px;
`;

const Label = styled.label`
  color: seagreen;
  font-size:13px;

  @media screen and (max-width: 650px) {
  margin-top: -6px;
    }
`


function CheckInForm({onClose}) {

  const [loading, setLoading] = useState(false);
  
  const popupRef = useRef(null);  // Create ref for the popup container
  const [location, setLocation] = useState({lat:null,lon:null});
  const [formData, setFormData] = useState({
    name:"",
    index_no:"",
    programme:"",
    level:"",
  })
  const [distance, setDistance] = useState(null);

  // Add click-outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();  // Close popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);  // Re-run if `onClose` changes

  const [hostCoords, setHostCoords] = useState({lat:null, lon: null})
  
  useEffect(() => {
    const fetchHostCoords = async () => {
      try {
        const response = await fetch(` https://d4507f0f0c55.ngrok-free.app/api/host-location?programme=${formData.programme}`);
        const data = await response.json();
        console.log("Here issssss");
        setHostCoords({ lat: data.location.lat, lon: data.location.lon });
      } catch (err) {
        console.log(err);
      }
    };

    if (formData.programme) {
      fetchHostCoords();
    }
  }, [formData.programme]);


  const { lat: hostLat, lon: hostLon } = hostCoords;

  useEffect(() => {if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        )
      },
      (err) => {console.log(err)}
    )

  }
  else{
    console.log("Error")
  }

  },[])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: location.lat,
        lon: location.lon,
      },
    }));
  }, [location]);

  const { lat: checkinLat, lon: checkinLon } = location;

useEffect(() => {
  if (checkinLat && hostLat) {
    const R = 6371;
    const toRad = angle => angle * (Math.PI / 180);
    const dLat = toRad(checkinLat - hostLat);
    const dLon = toRad(checkinLon - hostLon);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(hostLat)) * Math.cos(toRad(checkinLat)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    setDistance(R * c);
  }
}, [checkinLat, checkinLon, hostLat, hostLon]);


  const handleName = (e) => {
    setFormData(
      (prev) => ({...prev, name: e.target.value})
    )
  }

  const handleIndexNo = (e) => {
    setFormData(
      (prev) => ({...prev, index_no: e.target.value})
    )
  }

  const handleProgramme = (e) => {
    setFormData(
      (prev) => ({...prev, programme: e.target.value})
    )
  }

  const handleLevel = (e) => {
    setFormData(
      (prev) => ({...prev, level: e.target.value})
    )
  }

  const range = 0.014;


const handleSubmit = async (e) => {
  e.preventDefault(); // prevent default form behavior if used inside a <form>

  console.log(`lat:${formData.location.lat} and long: ${formData.location.lon}`);

  // Validate form fields
  if (!formData.name || !formData.index_no || !formData.programme || !formData.level) {
    alert("Please fill all required fields.");
    return;
  }

  setLoading(true); // Start loading

  // Check location distance range
  if (distance === null) {
    alert("Location is turned off. Please allow and try again.")
    console.log("Location is turned off. Please allow and try again.");
    console.log(distance);
    setLoading(false); // Stop loading
    return;
  }
  else if( distance > range){
    alert("You are out of range.")
    console.log("You are out of range.");
    console.log(distance);
    setLoading(false); // Stop loading
    return;
  }

  console.log("Sending data:", formData);

  try {
    const response = await fetch(" https://d4507f0f0c55.ngrok-free.app/api/checkin-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error:", data);
      setLoading(false); // Stop loading

    } else {
      console.log("Check-in successful:", data);
      console.log(distance);
      setLoading(false); // Stop loading
      onClose(); // close the form so the countdown shows
    }

  } catch (err) {
    console.error("Fetch error:", err);
    setLoading(false); // Stop loading

  }
};


  const getAllNames = async () =>{
    try{
      const response = await fetch(" https://d4507f0f0c55.ngrok-free.app/api/student-list");
      const students = await response.json();
      return students;
    }
    catch(err){
      console.log(`Couldn't get names: ${err}`)
    }
  }





  return (
    <Checkin ref= {popupRef}>
        <Header>Check-In </Header>
        <Label>Full name </Label>
        <Input type="text" 
        onChange={(e)=>handleName(e)}
        placeholder="Enter something" />

        <Label>Index Number </Label>
        <Input type="text" 
        onChange={(e)=>handleIndexNo(e)}
        placeholder="Enter something" />

        <Label>Progamme Initials & Course Code</Label>
        <Input type="text" 
        onChange={(e)=>handleProgramme(e)}
        placeholder="Enter something" />
        <Select1 value={formData.level} 
        onChange={(e)=>handleLevel(e)}>
            <option value="Level 100">Level 100</option>
            <option value="Level 200">Level 200</option>
            <option value="Level 300">Level 300</option>
            <option value="Level 400">Level 400</option>
        </Select1>
        <Button onClick={(e) => handleSubmit(e)} disabled={loading}>
          {loading ? (
            <img src={loader} alt="Loading" style={{ width: "24px", height: "24px" }} />
          ) : (
            "Submit"
          )}
        </Button>


    </Checkin>
  );
}

export default CheckInForm;
