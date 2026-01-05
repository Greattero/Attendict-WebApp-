import jsPDF from 'jspdf';
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
  const [myProgramme, setMyProgramme] = useState("");

  useEffect(()=>{
    setMyProgramme(programme)
  },[programme])


  const getAllNames = async () =>{
    try{
      const response = await fetch(`https://attendict.onrender.com/api/student-list?programme=${myProgramme}`);
      console.log(myProgramme);
      const students = await response.json();
      return students;
    }
    catch(err){
      console.log(`Couldn't get names: ${err}`)
    }
  }

  const deleteCollection = async (myProgramme) => {

    try{
      const delResponse = await fetch("https://attendict.onrender.com/api/delete-collection",{
        method:"DELETE",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({collection_name: myProgramme}),
      });

      const raw = localStorage?.getItem("pendingDeletes");
      if (!raw) return;

      const { time, data } = JSON?.parse(raw);
      localStorage?.setItem("pendingDeletes", JSON?.stringify(data?.filter(n => n !== myProgramme)));

      const result = await delResponse.json();
      console.log(result.message);

    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    let endTime = localStorage.getItem("endTime");

    if (!endTime && hostTime > 0) {
      const hostSeconds = Number(hostTime);
      if (!isNaN(hostSeconds)) {
        endTime = Date.now() + hostSeconds * 60 * 1000;
        localStorage.setItem("endTime", endTime);
        setHostTime(0);
      }
    }

    // ❌ Don’t run timer if endTime is missing
    if (!endTime) return;

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
          if(students === undefined || students === null){
            deleteCollection(myProgramme);
            return alert("Document coudn't be saved. Check internet connection and try again");
          }
          const date = new Date();
          const doc = new jsPDF();
          doc.setFont("helvetica");
          doc.setFontSize(14);
          doc.text(`${myProgramme} Attendance Sheet`, 10, 10);
          let y = 20;
          students.forEach((student,index)=>{
            let line = `${index + 1}. ${student.name} - ${student.index_no}`;
            if(student.doubtChecker === "1")
            {
              doc.setFillColor(255, 255, 0);
              doc.rect(10, y - 7, 190, 10, 'F'); // x, y, width, height, fill
              line += "  Check if in class👀";
            }

              // Check if next line will overflow
            if (y >= 820) {
              doc.addPage();
              y = 20; // reset Y for new page
            }


            doc.text(line, 10, y);
            y+=10; // move to the next line
            console.log("DEBUG:", student.name, student.doubtChecker, typeof student.doubtChecker);
          });

          doc.save(`${myProgramme}_${date.toLocaleDateString()}`);

          console.log("Done");
          console.log(myProgramme);
          console.log(students);
          alert("Document saved successfully");
          deleteCollection(myProgramme);
          setStudents([]);
        });
        localStorage.removeItem("endTime");
        clearInterval(interval);
      }
    }, 1000);

    const fetchNames = setInterval(()=>{
      getAllNames()
    },5000)

    return () =>{ 
      clearInterval(interval);
      clearInterval(fetchNames);
      
    };
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