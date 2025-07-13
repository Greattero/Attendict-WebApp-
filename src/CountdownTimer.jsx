import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const Timer = styled.label`
  font-family: 'Roboto Mono', monospace;
  color: black;
  padding-top: 45px;
  font-size: 25px;
`;

const CountdownTimer = ({ hostTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let endTime = localStorage.getItem("endTime");

    if (!endTime && hostTime) {
      const hostSeconds = Number(hostTime);
      if (!isNaN(hostSeconds)) {
        endTime = Date.now() + hostSeconds * 60 * 1000;
        localStorage.setItem("endTime", endTime);
      }
    }

    const interval = setInterval(() => {
      const savedEndTime = Number(localStorage.getItem("endTime"));
      const remaining = Math.floor((savedEndTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        console.log("Done");
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
