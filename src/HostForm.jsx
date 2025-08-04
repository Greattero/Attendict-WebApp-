import styled from "styled-components";
import React, { useEffect, useRef, useState} from 'react';
import loader from './assets/rolling.svg';


const Hosting = styled.div`
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

const Select2 = styled.select`
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

`;

const LabelHint = styled.label`
  text-align: center;
  color: gray;
  font-size: 12px;
  font-style: italic;
`;


function HostForm({onClose, setHostTime, setProgramme}) {


  const [loading, setLoading] = useState(false);

  const popupRef = useRef(null);  // Create ref for the popup container

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



  const [location, setLocation] = useState({lon:null,lat:null});

  const [ip, setIP] = useState("");

  useEffect(()=>{
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIP(data.ip))
      .catch((err) => console.log(err))
  },[]);
  
  const [formData,setFormData] = useState({
    name:"",
    index_no:"",
    programme:"",
    level:"",
    duration: "",
    myip: "",
    location:{
      lat:location.lat,
      lon: location.lon,
    }
  });

  
  useEffect(() => {if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({lon: position.coords.longitude, 
                    lat: position.coords.latitude}
        )
      },
      (err) => {console.log(err)}
    )
  }
  else{
    console.log("Cannot find location")
  }}
,[])


  useEffect(() => {
  const username = localStorage.getItem("username");
  setFormData((prev) => ({
    ...prev,
    location: {
        lat: location.lat != null ? Number(location.lat.toFixed(6)) : null,
        lon: location.lon != null ? Number(location.lon.toFixed(6)) : null,
      },
    myip: ip,
    index_no: username,
  }));
}, [location,ip]);

  const handleName = (e) => {
    setFormData((prev) => ({...prev, name: e.target.value}))
  };

  const handleIndexNo = () => {
    setFormData(
      (prev) => ({...prev, index_no: username})
    )
  }

  const handleProgramme = (e) => {
    const val = e.target.value.replace(/[.\s]/g, "").toUpperCase();
    setFormData(
      (prev) => ({...prev, programme: val})
    )
  };

  const handleLevel = (e) => {
    setFormData((prev) => ({...prev, level: e.target.value}))
  };


  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(`lat:${formData.location.lat} and long: ${formData.location.lon}`);
    
    if (!formData.name || !formData.programme || !formData.level || !formData.duration) {
      alert("Please fill all required fields.");
      return;
    }

    if(formData.programme.length !== 5){
      alert("Programme code must be 5 characters");
      return;
    }

    if(formData.location.lat === null || formData.location.lon === null){
      alert("Location not found 😬. Check if location is on. Refresh and try again.");
      return;
    }

    setLoading(true); // Start loading

    console.log(`lat:${formData.location.lat} and long: ${formData.location.lon}`);
    console.log(`Your IP is ${ip}`);
    console.log("Sending data:", formData);

    try {
      const response = await fetch("https://attendict.onrender.com/api/host-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.dbAvailable) {
        alert("Session already exists. Please try again in a few minutes.");
        setLoading(false);
        console.log(`Was it: ${data.dbAvailable}`);
        onClose();
        return;
      }

      if (!response.ok) {
        console.error("Server error:", data);
        alert("Unstable internet connection. Try Again😬");
        setLoading(false);
        onClose();
      } else {
        console.log("Successfully submitted:", data);
        alert("Submitted Successfully🎉");
        setLoading(false); // Stop loading

        setHostTime(null);
        setTimeout(() => {
        setHostTime(formData.duration);
        setProgramme(formData.programme);
        }, 0);

        onClose();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Unstable connection. Try Again");
      setLoading(false);
      onClose();
    }
  };




  return (
    <Hosting ref= {popupRef}>
        <Header>HOST </Header>
        <LabelHint>(for Lecturers/class reps only)</LabelHint>
        <Label>Full name </Label>
        <Input 
        type="text"
        value={formData.name}
        onChange={(e)=>handleName(e)}
        placeholder="Ex. Jessica Sedinam" />

        <Label>Index Number </Label>
        <Input type="text" 
        value={formData.index_no}
        onChange={()=>handleIndexNo()}
        disabled  />

        <Label>Progamme Initials & Course Code</Label>
        <Input type="text" 
        value={formData.programme}
        onChange = {(e)=>handleProgramme(e)}
        placeholder="Ex. CE123" />

        <Select1 value = {formData.level}
        onChange={(e)=> handleLevel(e)}>
            <option value="" disabled>Select level</option>
            <option value = "Level 100">Level 100</option>
            <option value = "Level 200">Level 200</option>
            <option value = "Level 300">Level 300</option>
            <option value = "Level 400">Level 400</option>
        </Select1>
        <Select2
          value={formData.duration}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, duration: e.target.value }))
          }
        >
          <option value="" disabled>Select duration</option> {/* this one is key */}
          <option value="2">2 min</option>
          <option value="3">3 min</option>
        </Select2>

        <Button onClick={(e) => handleSubmit(e)} disabled={loading}>
          {loading ? (
            <img src={loader} alt="Loading" style={{ width: "24px", height: "24px" }} />
          ) : (
            "Submit"
          )}
        </Button>

    </Hosting>
  );
}

export default HostForm;



