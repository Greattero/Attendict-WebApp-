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
`;

const LabelHint = styled.label`
  text-align: center;
  color: gray;
  font-size: 12px;
  font-style: italic;
`;


function CheckInForm({onClose,disableLogout}) {

  const [loading, setLoading] = useState(false);
  
  const popupRef = useRef(null);  // Create ref for the popup container
  const [location, setLocation] = useState({lat:null,lon:null});


  const [ip, setIP] = useState("");

  useEffect(()=>{
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIP(data.ip))
      .catch((err) => console.log(err))
  },[]);


  const [formData, setFormData] = useState({
    name:"",
    index_no:"",
    programme:"",
    level:"",
    myip:"",
    inspect: "",
    checkedTime: new Date().toLocaleTimeString(),
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
    // Clear any previously valid coordinates when programme changes
    setHostCoords({ lat: null, lon: null });
  }, [formData.programme]);

  // Main polling logic
  const triedProgrammesRef = useRef(new Set());
  const attemptsMapRef = useRef(new Map()); // 💡 Track attempts per programme

  useEffect(() => {
    let intervalId;

    const fetchHostCoords = async () => {
      const currentProg = formData.programme;
      let attempts = attemptsMapRef.current.get(currentProg) || 0;

      // Prevent extra calls after 5 attempts
      if (attempts >= 5) {
        clearInterval(intervalId);
        return;
      }

      try {
        const response = await fetch(`https://attendict.onrender.com/api/host-location?programme=${currentProg}`);
        const data = await response.json();

        if (data?.location?.lat && data?.location?.lon) {
          setHostCoords({ lat: data.location.lat, lon: data.location.lon });
          clearInterval(intervalId);
        } else {
          attempts += 1;
          attemptsMapRef.current.set(currentProg, attempts); // 🔁 Track attempts

          if (attempts >= 5) {
            clearInterval(intervalId);
            triedProgrammesRef.current.add(currentProg);
            //console.log("❌ Host location not found after 5 attempts.");
          }
        }
      } catch (err) {
        //console.log("❌ Error fetching host location:", err);
        attempts += 1;
        attemptsMapRef.current.set(currentProg, attempts);

        if (attempts >= 5) {
          clearInterval(intervalId);
          triedProgrammesRef.current.add(currentProg);
        }
      }
    };

    const currentProg = formData.programme;

    if (
      currentProg.length === 5 &&
      !triedProgrammesRef.current.has(currentProg)
    ) {
      intervalId = setInterval(fetchHostCoords, 500);
    }

    return () => clearInterval(intervalId);
  }, [formData.programme]);




  // ✅ NEW: useEffect to track updated hostCoords
  useEffect(() => {
    if (hostCoords.lat !== null && hostCoords.lon !== null) {
      //console.log(`✅ Updated Host lat: ${hostCoords.lat}, lon: ${hostCoords.lon}`);
    }
  }, [hostCoords]);




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

  const handleIndexNo = () => {
    const username = localStorage.getItem("username");
    setFormData(
      (prev) => ({...prev, index_no: username})
    )
  }

  const handleProgramme = (e) => {
    const val = e.target.value.replace(/[.\s]/g,"").toUpperCase();
    setFormData(
      (prev) => ({...prev, programme: val})
    )
  }

  const handleLevel = (e) => {
    setFormData(
      (prev) => ({...prev, level: e.target.value})
    )
  }

  const range = 1.600;


const handleSubmit = async (e) => {
  e.preventDefault(); // prevent default form behavior if used inside a <form>

  //console.log(`lat:${formData.location.lat} and long: ${formData.location.lon}`);

  // Validate form fields
  if (!formData.name || !formData.programme || !formData.level) {
    alert("Please fill all required fields.");
    return;
  }

  if(formData.programme.length !== 5){
      alert("Programme code must be 5 characters");
      return;
  }

  setLoading(true); // Start loading

  // Check location distance range
  if (distance === null && !hostCoords.lat) {
    alert("Host location not found 😬. Check course code or turn on location. Then refresh and try again.");
    //console.log("Couldn't get Host location. Try again");
    //console.log(distance);
    setLoading(false); // Stop loading
    return;
  }
  else if( distance > range){
    alert(`You are out of range 😭.Refresh and try again ${distance}`);
    //console.log("You are out of range.");
    //console.log(distance);
    setLoading(false); // Stop loading
    return;
  }

    setFormData((prev) => ({
      ...prev,
      inspect: distance > 0.1 && distance < 1.6 ? "1" : "0"
    }));

 // console.log("Sending data:", formData);

  try {
    const response = await fetch("https://attendict.onrender.com/api/checkin-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.dbAvailable) {
      alert("Session doesn't exist");
      setLoading(false);
      //console.log(`Was it: ${data.dbAvailable}`);
      onClose();
      return;
    }

    if(data.available){
      alert("😕 Oops! Too many check-ins on this network. Switch to another connection 🌐");
      setLoading(false); // Stop loading
      onClose();
      return;
    }

    if (!response.ok) {
      //console.error("Server error:", data);
      alert("Unstable internet connection. Try again😬")
      setLoading(false); // Stop loading
      

    } else {
      //console.log("Check-in successful:", data);
      alert(`Submitted Successfully🎉\nYou are ${distance.toFixed(3)}km away`);
      //console.log(distance);
      setLoading(false); // Stop loading
      onClose(); // close the form so the countdown shows

      disableLogout(true);
      localStorage.setItem("logoutDisabledUntil", Date.now() + 3 * 60 * 1000);

      setTimeout(() => {
        disableLogout(false);
        localStorage.removeItem("logoutDisabledUntil");
      }, 3 * 60 * 1000);
    }

  } catch (err) {
    console.error("Fetch error:", err);
    setLoading(false); // Stop loading

  }
};



  return (
    <Checkin ref= {popupRef}>
        <Header>Check-In </Header>
        <LabelHint>(for class members)</LabelHint>
        <Label>Full name </Label>
        <Input type="text"
        value={formData.name}
        onChange={(e)=>handleName(e)}
        placeholder="Ex: Jessica Sedinam" />

        <Label>Index Number </Label>
        <Input type="text"
        value={formData.index_no}
        onChange={()=>handleIndexNo()}
        disabled/>

        <Label>Progamme Initials & Course Code</Label>
        <Input type="text"
        value={formData.programme}
        onChange={(e)=>handleProgramme(e)}
        placeholder="Ex: CE123" />

        <Select1 value={formData.level} 
        onChange={(e)=>handleLevel(e)}>
            <option value="" disabled>Select level</option>
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




















