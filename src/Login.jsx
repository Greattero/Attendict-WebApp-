import styled, { keyframes, createGlobalStyle } from "styled-components";
import "boxicons/css/boxicons.min.css";
import React, { useState } from "react";
import loader from "./assets/rolling.svg";
import newPic from "./assets/newPic.png";
import { apiPost } from "./apiClient";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap');
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Outer shell ── */
const LogBody = styled.div`
  font-family: "Nunito", sans-serif;
  position: relative;
  width: 860px;
  height: 540px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 420px;
    height: auto;
    flex-direction: column;
    border-radius: 20px;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.06);
  }
`;

/* ── Left panel (brand) — desktop only ── */
const Welcome = styled.div`
  width: 44%;
  background: linear-gradient(135deg, #2e8b57, #3aab6a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    top: -80px;
    right: -80px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    bottom: -60px;
    left: -60px;
  }

  .brand-icon {
    width: 200px;
    height: 120px;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h1 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    margin: 0 0 0.75rem;
    letter-spacing: -0.5px;
    text-align: center;
  }

  p {
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    opacity: 0.9;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
  }

  /* Hide entirely on mobile */
  @media (max-width: 900px) {
    display: none;
  }
`;

/* ── Mobile logo — shown only on small screens ── */
const MobileLogo = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 2rem 0.5rem;

    .brand-image {
      width: 200px;
      height: 120px;
      border-radius: 16px;
      object-fit: cover;
    }

    .text-wrap {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem;
      letter-spacing: -0.5px;
    }

    p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
      font-weight: 500;
      line-height: 1.5;
    }
  }
`;

/* ── Right panel (form) ── */
const FormBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem;
  background: #fff;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: 900px) {
    padding: 1.5rem 2rem 2.5rem;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0;

  .form-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 0.25rem;
    letter-spacing: -0.5px;
    text-align: center;

    @media (max-width: 900px) {
      text-align: center;
      display: none;
    }
  }

  .form-sub {
    font-size: 0.85rem;
    color: #9ca3af;
    margin: 0 0 1.75rem;
    font-weight: 500;
    text-align: center;

    @media (max-width: 900px) {
      text-align: center;
      display: none;
    }
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding: 0.85rem 2.8rem 0.85rem 1rem;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 0.95rem;
    font-family: "Nunito", sans-serif;
    color: #1f2937;
    font-weight: 500;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;

    &::placeholder {
      color: #d1d5db;
      font-weight: 400;
    }

    &:focus {
      border-color: #3aab6a;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(58, 171, 106, 0.12);
    }
  }

  i {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #b0b3c6;
    pointer-events: none;
  }
`;

const RoleSection = styled.div`
  margin-bottom: 1.25rem;

  .role-label {
    font-size: 0.82rem;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
  }

  .role-options {
    display: flex;
    gap: 0.75rem;
  }
`;

const RoleChip = styled.button`
  flex: 1;
  padding: 0.6rem 0.5rem;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#3aab6a" : "#e5e7eb")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #2e8b57, #3aab6a)" : "#f9fafb"};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  font-family: "Nunito", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  i {
    font-size: 15px;
  }

  &:hover {
    border-color: #3b82f6;
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #2563eb, #3b82f6)"
        : "rgba(59,130,246,0.05)"};
    color: ${({ $active }) => ($active ? "white" : "#2563eb")};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #2e8b57, #3aab6a);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  color: white;
  font-weight: 700;
  letter-spacing: 0.3px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;

  &:hover:not(:disabled) {
    opacity: 0.95;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 139, 87, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FootNote = styled.p`
  text-align: center;
  font-size: 0.78rem;
  color: #b0b3c6;
  margin: 1rem 0 0;

  i {
    font-size: 13px;
    vertical-align: middle;
    margin-right: 3px;
  }
`;

/* ── Component ── */
function Login({ onLoginSuccess, sendFeedback, sendVisible, sendWhoIAm }) {
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const handleUsername = (e) =>
    setLoginData((prev) => ({
      ...prev,
      username: e.target.value.toUpperCase(),
    }));

  const handlePassword = (e) =>
    setLoginData((prev) => ({
      ...prev,
      password: e.target.value.toUpperCase(),
    }));

  if (loginData.username?.startsWith("LECTURER")) sendWhoIAm("rep");

  const getDeviceData = () => ({
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      (!loginData.username || !loginData.password || person === "") &&
      !loginData.username?.startsWith("LECTURER")
    ) {
      alert("Please fill all fields");
      return;
    }
    if (loginData.username !== loginData.password){
      alert("Incorrect username or password");      
    }
    setLoading(true);
    try {
      const deviceData = getDeviceData();
      const response = await apiPost("/api/login-details", {
        ...loginData,
        deviceData,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("username",loginData.username);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("personType", person || "rep");
        sendVisible(true);
        sendFeedback("correctLogs");
        onLoginSuccess();
      } else if (data.success && !data.token) {
        alert("Login error: No session token received. Please try again.");
        setLoading(false);
      } else {
        alert(
          (data.message || "Invalid Username or password") +
            " Please try again.",
        );
        setLoading(false);
      }
    } catch (err) {
      alert("Unstable internet connection. Please try again");
      console.log(err);
      setLoading(false);
    }
  };

  const isLecturer = loginData.username?.startsWith("LEC");

  return (
    <>
      <GlobalStyle />
      <LogBody>
        {/* ── Left brand panel — desktop only ── */}
        <Welcome>
          <div className="brand-icon">
            <img src={newPic} alt="Attendict Logo" />
          </div>
          <div className="text-wrap">
            <h1>Attendict</h1>
            <p>Take control of your classroom attendance effortlessly.</p>
          </div>
        </Welcome>

        {/* ── Logo — mobile only ── */}
        <MobileLogo>
          <img src={newPic} alt="Attendict Logo" className="brand-image" />
          <div className="text-wrap">
            <h1>Attendict</h1>
            <p>Take control of your classroom attendance effortlessly.</p>
          </div>
        </MobileLogo>

        {/* ── Form panel ── */}
        <FormBox>
          <Form onSubmit={handleLogin}>
            <h2 className="form-title ">Sign in</h2>
            <p className="form-sub">Enter your credentials to continue</p>

            <InputGroup>
              <input
                type="text"
                placeholder="Index Number"
                value={loginData.username}
                onChange={handleUsername}
                required
              />
              <i className="bx bxs-user" />
            </InputGroup>

            <InputGroup>
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handlePassword}
                required
              />
              <i className="bx bxs-lock" />
            </InputGroup>

            {!isLecturer && (
              <RoleSection>
                {/* <span className="role-label">I am a…</span> */}
                <div className="role-options">
                  <RoleChip
                    type="button"
                    $active={person === "rep"}
                    onClick={() => {
                      setPerson("rep");
                      sendWhoIAm("rep");
                    }}
                  >
                    <i className="bx bxs-user-badge" /> Course Rep
                  </RoleChip>
                  <RoleChip
                    type="button"
                    $active={person === "member"}
                    onClick={() => {
                      setPerson("member");
                      sendWhoIAm("member");
                    }}
                  >
                    <i className="bx bxs-group" /> Class Member
                  </RoleChip>
                </div>
              </RoleSection>
            )}

            <LoginButton type="submit" disabled={loading}>
              {loading ? (
                <img
                  src={loader}
                  alt="Loading"
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                "Login"
              )}
            </LoginButton>

            <FootNote>
              <i className="bx bx-shield-quarter" />
              Best viewed on Google Chrome
            </FootNote>
          </Form>
        </FormBox>
      </LogBody>
    </>
  );
}

export default Login;
