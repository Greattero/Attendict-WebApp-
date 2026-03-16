import styled, { keyframes } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import loader from "./assets/rolling.svg";
import "boxicons/css/boxicons.min.css";
import { apiGet, apiPost } from "./apiClient";

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  z-index: 1000;
`;

const Checkin = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-height: 90dvh;
  overflow-y: auto;
  border-radius: 20px;
  background: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  z-index: 1001;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  font-family: "Nunito", sans-serif;
  animation: ${fadeIn} 0.25s ease both;

  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 650px) {
    width: calc(100vw - 2.5rem);
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  .icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2e8b57, #3aab6a);
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 20px;
      color: white;
    }
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    letter-spacing: -0.4px;
  }
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;

  i { font-size: 18px; }

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #ef4444;
  }
`;

const Hint = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
  margin: 0 0 0.75rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #f3f4f6;
  margin: 0.5rem 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 1rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  font-family: "Nunito", sans-serif;
  font-weight: 500;
  font-size: 0.92rem;
  color: #1f2937;
  transition: all 0.2s;
  box-sizing: border-box;

  &::placeholder { color: #d1d5db; font-weight: 400; }

  &:focus {
    outline: none;
    border-color: #3aab6a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(58, 171, 106, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 1rem;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  font-family: "Nunito", sans-serif;
  font-weight: 500;
  font-size: 0.92rem;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3aab6a;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(58, 171, 106, 0.12);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #2e8b57, #3aab6a);
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;

  &:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 139, 87, 0.3);
  }

  &:active { transform: translateY(0); }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

function CheckInForm({
  onClose,
  disableLogout,
  sendFeedback,
  sendVisible,
  getLocation,
}) {
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [pendingSubmit, setPendingSubmit] = useState(null);
  const [ip, setIP] = useState("");

  useEffect(() => {
    if (getLocation?.lat != null && getLocation?.lon != null) {
      setLocation(getLocation);
    }
  }, [getLocation]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setIP(d.ip))
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: "", index_no: "", programme: "", level: "",
    myip: "", checkedTime: new Date().toLocaleTimeString(),
  });
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const [hostCoords, setHostCoords] = useState({ lat: null, lon: null });

  useEffect(() => {
    setHostCoords({ lat: null, lon: null });
  }, [formData.programme]);

  const triedProgrammesRef = useRef(new Set());
  const attemptsMapRef = useRef(new Map());

  useEffect(() => {
    let intervalId;
    const fetchHostCoords = async () => {
      const currentProg = formData.programme;
      let attempts = attemptsMapRef.current.get(currentProg) || 0;
      if (attempts >= 50) { clearInterval(intervalId); return; }
      try {
        const response = await apiGet(`/api/host-location?programme=${currentProg}`);
        const data = response.data;
        if (data?.location?.lat && data?.location?.lon) {
          setHostCoords({ lat: Number(data.location.lat), lon: Number(data.location.lon) });
          clearInterval(intervalId);
        } else {
          attempts += 1;
          attemptsMapRef.current.set(currentProg, attempts);
          if (attempts >= 50) {
            clearInterval(intervalId);
            triedProgrammesRef.current.add(currentProg);
            onClose();
          }
        }
      } catch (err) {
        attempts += 1;
        attemptsMapRef.current.set(currentProg, attempts);
        if (attempts >= 50) {
          clearInterval(intervalId);
          triedProgrammesRef.current.add(currentProg);
        }
      }
    };
    const currentProg = formData.programme;
    if (currentProg.length === 5 && !triedProgrammesRef.current.has(currentProg)) {
      intervalId = setInterval(fetchHostCoords, 1000);
    }
    return () => clearInterval(intervalId);
  }, [formData.programme]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: location?.lat != null ? Number(location.lat) : null,
        lon: location?.lon != null ? Number(location.lon) : null,
      },
      myip: ip,
      index_no: username,
    }));
  }, [location, ip]);

  const { lat: checkinLat, lon: checkinLon } = location || {};
  const { lat: hostLat, lon: hostLon } = hostCoords;

  useEffect(() => {
    if (checkinLat != null && checkinLon != null && hostLat != null && hostLon != null) {
      const R = 6371;
      const toRad = (a) => a * (Math.PI / 180);
      const dLat = toRad(checkinLat - hostLat);
      const dLon = toRad(checkinLon - hostLon);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(hostLat)) * Math.cos(toRad(checkinLat)) * Math.sin(dLon / 2) ** 2;
      setDistance(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
  }, [checkinLat, checkinLon, hostLat, hostLon]);

  const handleName = (e) => setFormData((p) => ({ ...p, name: e.target.value }));
  const handleIndexNo = () => setFormData((p) => ({ ...p, index_no: localStorage.getItem("username") }));
  const handleProgramme = (e) => {
    const val = e.target.value.replace(/[.\s]/g, "").toUpperCase();
    setFormData((p) => ({ ...p, programme: val }));
  };
  const handleLevel = (e) => setFormData((p) => ({ ...p, level: e.target.value }));

  const range = 0.1;

  useEffect(() => {
    if (!pendingSubmit) return;
    if (distance != null) {
      setPendingSubmit(false);
      submitData();
      return;
    }
    const t = setTimeout(() => {
      setPendingSubmit(false);
      submitData();
    }, 50000);
    return () => clearTimeout(t);
  }, [pendingSubmit, hostCoords.lat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.programme || !formData.level) {
      alert("Please fill all required fields.");
      return;
    }
    if (!location?.lat || !location?.lon) {
      alert("Location still fetching 😬. Please wait.");
      return;
    }
    if (formData.programme.length !== 5) {
      alert("Course code must be 5 characters");
      return;
    }
    setLoading(true);
    setPendingSubmit(true);
  };

  const submitData = async () => {
    if (distance == null || hostCoords.lat == null || hostCoords.lon == null) {
      alert("Couldn't fetch course rep/lecturer's location. Please check in again.");
      setLoading(false);
      return;
    } else if (distance > range) {
      alert(`You are out of range 😭. Refresh and try again. (${distance}km)`);
      setLoading(false);
      return;
    }
    try {
      const response = await apiPost("/api/checkin-details", { ...formData, distance });
      const data = response.data;
      if (data.dbAvailable) {
        sendVisible(true); sendFeedback("noSession");
        setLoading(false); onClose(); return;
      }
      if (data.available) {
        sendVisible(true); sendFeedback("alreadyCheckedin");
        setLoading(false); onClose(); return;
      }
      if (!response.ok) {
        alert("Unstable internet connection. Try again 😬");
        setLoading(false);
      } else {
        alert(`Submitted Successfully 🎉\nYou are ${distance}km away`);
        sendVisible(true); sendFeedback("checkedinCorrectly");
        setLoading(false); onClose();
        disableLogout(true);
        localStorage.setItem("logoutDisabledUntil", Date.now() + 1 * 60 * 1000);
        setTimeout(() => {
          disableLogout(false);
          localStorage.removeItem("logoutDisabledUntil");
        }, 3 * 60 * 1000);
      }
    } catch (err) {
      console.log("Fetch error:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay />
      <Checkin ref={popupRef}>

        {/* ── Header ── */}
        <ModalHeader>
          <TitleGroup>
            <div className="icon-wrap">
              <i className="bx bxs-user-check" />
            </div>
            <h2>Check In</h2>
          </TitleGroup>
          <CloseBtn onClick={onClose}>
            <i className="bx bx-x" />
          </CloseBtn>
        </ModalHeader>

        <Hint>For class members only</Hint>
        <Divider />

        {/* ── Full name ── */}
        <FieldGroup>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={handleName}
            placeholder="e.g. Maame Esi"
          />
        </FieldGroup>

        {/* ── Index number ── */}
        <FieldGroup>
          <Label>Index Number</Label>
          <Input
            type="text"
            value={formData.index_no}
            onChange={handleIndexNo}
            disabled
          />
        </FieldGroup>

        {/* ── Course code ── */}
        <FieldGroup>
          <Label>Course Code</Label>
          <Input
            type="text"
            value={formData.programme}
            onChange={handleProgramme}
            placeholder="e.g. CE123"
            maxLength={5}
          />
        </FieldGroup>

        {/* ── Level ── */}
        <FieldGroup>
          <Label>Level</Label>
          <Select value={formData.level} onChange={handleLevel}>
            <option value="" disabled>Select level</option>
            <option value="Level 100">Level 100</option>
            <option value="Level 200">Level 200</option>
            <option value="Level 300">Level 300</option>
            <option value="Level 400">Level 400</option>
          </Select>
        </FieldGroup>

        {/* ── Submit ── */}
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <img src={loader} alt="Loading" style={{ width: 22, height: 22 }} />
          ) : (
            <>
              <i className="bx bx-map-pin" />
              Check In
            </>
          )}
        </SubmitBtn>

      </Checkin>
    </>
  );
}

export default CheckInForm;
