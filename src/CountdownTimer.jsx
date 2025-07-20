import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const Timer = styled.label`
  font-family: 'Roboto Mono', monospace;
  color: black;
  padding-top: 45px;
  font-size: 25px;
`;

const CountdownTimer = ({ hostTime, setHostTime, lockCheckin, unLockCheckin,programme}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [students, setStudents] = useState([]);


  const getAllNames = async () =>{
    try{
      const response = await fetch(`https://attendict.onrender.com/api/student-list?programme=${programme}`);
      console.log(programme);
      const students = await response.json();
      return students;
    }
    catch(err){
      console.log(`Couldn't get names: ${err}`)
    }
  }

  useEffect(() => {
    let endTime = localStorage.getItem("endTime");

    if (!endTime && hostTime) {
      const hostSeconds = Number(hostTime);
      if (!isNaN(hostSeconds)) {
        endTime = Date.now() + hostSeconds * 60 * 1000;
        localStorage.setItem("endTime", endTime);

        // Reset hostTime to 0 so selecting the same value later re-triggers the effect
        setHostTime(0);
      }
    }

    const interval = setInterval(() => {
      const savedEndTime = Number(localStorage.getItem("endTime"));
      const remaining = Math.floor((savedEndTime - Date.now()) / 1000);
      if (remaining > 0) {
        lockCheckin();
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        unLockCheckin();
        getAllNames().then(students => {
            if(students && students.length > 0){
            setStudents([]); // <- CLEAR HERE
            console.log("Done");
            console.log(programme);
            console.log(students);
            setStudents([]); // <- CLEAR HERE
            }
          });
        
        localStorage.removeItem("endTime");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hostTime]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div>
      <Timer>{formatTime(timeLeft)}</Timer>
    </div>
  );
};

export default CountdownTimer;
