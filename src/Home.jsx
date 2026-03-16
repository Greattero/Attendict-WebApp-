import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import "boxicons/css/boxicons.min.css";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap');
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(240, 209, 174, 0.5); }
  50%       { box-shadow: 0 0 0 8px rgba(240, 209, 174, 0); }
`;

const HomePage = styled.div`
  font-family: "Nunito", sans-serif;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  padding: 2rem 1rem;
  gap: 2.5rem;
  box-sizing: border-box;

  @media (max-width: 650px) {
    padding: 1.25rem 1rem;
    gap: 1.75rem;
    min-height: 100dvh;
    justify-content: center;
  }
`;

const Greeting = styled.div`
  text-align: center;
  animation: ${fadeUp} 0.5s ease both;

  h1 {
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 0.4rem;
    letter-spacing: -0.7px;
  }

  p {
    font-size: clamp(0.85rem, 2.5vw, 1rem);
    color: #6b7280;
    margin: 0;
    font-weight: 500;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 900px;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
  }
`;

const CardButton = styled.button`
  width: 200px;
  min-height: 150px;
  border-radius: 16px;
  border: 1px solid rgba(46, 139, 87, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafb 100%);
  box-shadow:
    0 4px 20px rgba(46, 139, 87, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeUp} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay || "0s"};

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 20px 40px rgba(46, 139, 87, 0.15),
      0 2px 8px rgba(46, 139, 87, 0.1);
    background: linear-gradient(135deg, #f8fafb 0%, #f0f4f8 100%);
    border-color: rgba(46, 139, 87, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }

  /* On mobile: full-width horizontal card */
  @media (max-width: 650px) {
    width: 100%;
    max-width: 360px;
    min-height: unset;
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem 1.25rem;
    gap: 1rem;
    border-radius: 14px;
  }
`;

const IconWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(46, 139, 87, 0.1) 0%,
    rgba(46, 139, 87, 0.05) 100%
  );
  border: 1px solid rgba(46, 139, 87, 0.15);
  box-shadow: 0 2px 8px rgba(46, 139, 87, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 22px;
    color: #3aab6a;
  }

  @media (max-width: 650px) {
    width: 46px;
    height: 46px;

    i {
      font-size: 20px;
    }
  }
`;

const CardLabel = styled.div`
  text-align: center;

  h2 {
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.25rem;
    letter-spacing: -0.3px;
  }

  span {
    font-size: 0.78rem;
    color: #9ca3af;
    font-weight: 500;
  }

  @media (max-width: 650px) {
    text-align: left;

    h2 {
      font-size: 0.95rem;
    }
  }
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #fef3c7, #fde98a);
  border: 1px solid #fbbf24;
  border-radius: 50px;
  padding: 0.65rem 1.4rem;
  color: #92400e;
  font-size: 0.88rem;
  font-weight: 600;
  animation:
    ${pulse} 3s ease infinite,
    ${fadeUp} 0.6s ease 0.4s both;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);

  .dot {
    width: 7px;
    height: 7px;
    background: #e08830;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 650px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
`;

function Home({ onButtonClick, disabled, getWhoIAm }) {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(getWhoIAm || localStorage.getItem("personType") || "");
  }, [getWhoIAm]);

  console.log("whyyy",role, getWhoIAm);

  const handleClick = (action, blockedMsg) => {
    if (disabled) {
      alert(blockedMsg);
      return;
    }
    onButtonClick(action);
  };

  return (
    <>
      <GlobalStyle />
      <HomePage>
        <Greeting>
          <h1>Welcome back 👋</h1>
          <p>What would you like to do today?</p>
        </Greeting>

        <Buttons>
          {role === "rep" && (
            <>
              <CardButton
                $delay="0.1s"
                onClick={() => handleClick("host", "A session is ongoing")}
              >
                <IconWrapper>
                  <i className="bx bxs-user"></i>
                </IconWrapper>
                <CardLabel>
                  <h2>Host</h2>
                  <span>Start a session</span>
                </CardLabel>
              </CardButton>

              <CardButton
                $delay="0.2s"
                onClick={() => handleClick("remove", "A session is ongoing")}
              >
                <IconWrapper>
                  <i className="bx bx-block"></i>
                </IconWrapper>
                <CardLabel>
                  <h2>Remove Session</h2>
                  <span>End active session</span>
                </CardLabel>
              </CardButton>
            </>
          )}

          {role === "member" && (
            <CardButton
              $delay="0.1s"
              onClick={() =>
                handleClick("checkin", "Can't check in when Host is in session")
              }
            >
              <IconWrapper>
                <i className="bx bxs-user-check"></i>
              </IconWrapper>
              <CardLabel>
                <h2>Check In</h2>
                <span>Mark your attendance</span>
              </CardLabel>
            </CardButton>
          )}
        </Buttons>

        <Notice>
          <span className="dot" />
          Make sure your location is turned on
        </Notice>
      </HomePage>
    </>
  );
}

export default Home;
