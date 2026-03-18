import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CheckInForm from "./CheckInForm.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import icon from "./assets/newPic.png";

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Heading = styled.header`
  font-family: "Nunito", sans-serif;
  position: sticky;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-sizing: border-box;
  animation: ${fadeDown} 0.4s ease both;
  position: relative;

  @media (max-width: 650px) {
    height: auto;
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(46, 139, 87, 0.2);
  }

  span {
    font-size: 1.15rem;
    font-weight: 800;
    color: #1f2937;
    letter-spacing: -0.4px;
  }

  @media (max-width: 650px) {
    flex: 0 0 auto;
    order: 1;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(239, 68, 68, 0.07);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s ease;

  i {
    font-size: 18px;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  @media (max-width: 400px) {
    padding: 0.45rem 0.7rem;
    font-size: 0;

    i {
      font-size: 20px;
    }
  }

  @media (max-width: 650px) {
    flex: 0 0 auto;
    order: 3;
  }
`;

const TimerContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 650px) {
    position: static;
    transform: none;
    flex: 1;
    justify-content: center;
    order: 2;
    width: 100%;
  }
`;

function AppHeader({
  onLogout,
  disableLogout,
  hostTime,
  setHostTime,
  lockCheckin,
  unLockCheckin,
  programme,
  resetProgramme,
  userRole,
}) {
    const [role, setRole] = useState("");
  
    useEffect(() => {
      // Check state first, else fallback to localStorage
      setRole(userRole || localStorage.getItem("personType") || "");
    }, [userRole]);
  
  const handleLogout = () => {
    if (!disableLogout) {
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      localStorage.removeItem("personType");
      onLogout();
    } else {
      alert("Logout will be available 1 minute after check-in. Hang tight!");
    }
  };

  return (
    <Heading>
      <Brand>
        <img src={icon} alt="Attendict logo" />
        <span>Attendict</span>
      </Brand>

      {(role === "rep" || role === "lecturer") && (
        <TimerContainer>
          <CountdownTimer
            key={hostTime}
            hostTime={hostTime}
            setHostTime={setHostTime}
            lockCheckin={lockCheckin}
            unLockCheckin={unLockCheckin}
            programme={programme}
            resetProgramme={resetProgramme}
          />
        </TimerContainer>
      )}

      <LogoutBtn onClick={handleLogout}>
        <i className="bx bx-log-out"></i>
        Log out
      </LogoutBtn>
    </Heading>
  );
}

export default AppHeader;
