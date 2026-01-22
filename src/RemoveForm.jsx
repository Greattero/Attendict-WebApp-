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
  font-size: 25px;
  margin-top: -10px;
  margin-left: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 25;

  @media screen and (max-width: 650px) {
  margin-left: 15px;  
  }

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





function RemoveForm({onClose,disableLogout, sendFeedback, sendVisible}) {



  const [loading, setLoading] = useState(false);

  

  const popupRef = useRef(null);  // Create ref for the popup container


  const [progName, setProgName] = useState();

  


  // Add click-outside handler

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (popupRef.current && !popupRef.current.contains(e.target)) {

        onClose();  // Close popup

      }

    };



    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [onClose]);  // Re-run if `onClose` cha



const handleSubmit = async (e) => {

  e.preventDefault(); // prevent default form behavior if used inside a <form>



  //console.log(`lat:${formData.location.lat} and long: ${formData.location.lon}`);



  // Validate form fields

  if (!progName) {

    alert("Please fill all required fields.");

    return;

  }



  if(progName.length !== 5){

      alert("Programme code must be 5 characters");

      return;

  }



  setLoading(true); // Start loading



  


 // console.log("Sending data:", formData);



  try {

    const response = await fetch(
  "https://attendict.onrender.com/api/delete-collection",
  {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collection_name: progName }),
  }
);

const data = await response.json();

if (!response.ok) {
  alert(data.message || "Delete failed");
  setLoading(false);
  return;
}

//alert("Session reset successfully");
sendVisible(true);
sendFeedback("removeSession");
setLoading(false);
onClose();




  } catch (err) {

    console.error("Fetch error:", err);

    setLoading(false); // Stop loading



  }

};







  return (

    <Checkin ref= {popupRef}>

        <Header >
          Remove Session 
              <i className='bx bx-x-circle' 
              onClick={()=>onClose()}
              style={{ color: '#628245', marginTop: "3px" }}/>        
        </Header>

        <LabelHint>(strictly for course reps and lecturers)</LabelHint>


        <Label>Progamme Initials & Course Code</Label>

        <Input type="text"

        value={progName}

        onChange={(e)=>setProgName(e.target.value.toUpperCase())}

        placeholder="Ex: CE123" />


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



export default RemoveForm;


