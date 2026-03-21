import styled, { keyframes } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import loader from "./assets/rolling.svg";
import "boxicons/css/boxicons.min.css";
import { apiPost, apiDelete } from "./apiClient";

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

const Hosting = styled.div`
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

  /* hide scrollbar but keep scroll */
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

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
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

function HostForm({
  onClose,
  setHostTime,
  setProgramme,
  sendFeedback,
  sendVisible,
  getLocation,
}) {
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const raw = localStorage.getItem("pendingDeletes");
      if (!raw || raw === "undefined") return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;
      const ONE_MIN = 1 * 60 * 1000;
      for (const item of parsed) {
        const [programme, time] = item.split("|");
        if (Date.now() - Number(time) < ONE_MIN) return;
        try {
          await apiDelete("/api/delete-collection", { collection_name: programme });
          const updated = parsed.filter((v) => v !== item);
          localStorage.setItem("pendingDeletes", JSON.stringify(updated));
        } catch (err) {}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [location, setLocation] = useState({ lon: null, lat: null });
  const [ip, setIP] = useState("");
  const [myTime, setMyTime] = useState("");

  useEffect(() => { setLocation(getLocation); }, [getLocation]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setIP(d.ip))
      .catch(() => {});
  }, []);

  useEffect(() => { setMyTime(new Date().toLocaleTimeString()); }, []);

  const [formData, setFormData] = useState({
    name: "", index_no: "", programme: "", level: "", duration: "",
    myip: "", location: { lat: null, lon: null },
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    setFormData((prev) => ({
      ...prev,
      location: { lat: location?.lat, lon: location?.lon },
      myip: ip,
      index_no: username,
      checkedTime: myTime,
    }));
  }, [location, ip, myTime]);

  const handleName = (e) => setFormData((p) => ({ ...p, name: e.target.value }));
  const handleIndexNo = () => setFormData((p) => ({ ...p, index_no: localStorage.getItem("username") }));
  const handleProgramme = (e) => {
    const val = e.target.value.replace(/[.\s]/g, "").toUpperCase();
    setFormData((p) => ({ ...p, programme: val }));
  };
  const handleLevel = (e) => setFormData((p) => ({ ...p, level: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.programme || !formData.level || !formData.duration) {
      alert("Please fill all required fields.");
      return;
    }
    if (formData.programme.length !== 5) {
      alert("Course code must be 5 characters");
      return;
    }
    if (!formData.location || formData.location.lat == null || formData.location.lon == null) {
      alert("Location still fetching 😬. Please wait.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiPost("/api/host-details", formData);
      const data = response.data;
      if (data.dbAvailable) {
        sendVisible(true);
        sendFeedback("sessionExists");
        setLoading(false);
        onClose();
        return;
      }
      if (!response.ok) {
        alert("table internet connection. Try Again 😬");
        setLoading(false);
        onClose();
      } else {
        sendVisible(true);
        sendFeedback("hostedSucessfully");
        setHostTime(null);
        setTimeout(() => {
          setHostTime(formData?.duration);
          setProgramme(formData?.programme);
        }, 0);
        const time = Date.now();
        const raw = localStorage.getItem("pendingDeletes");
        const parsed = raw && raw.startsWith("[") ? JSON.parse(raw) : [];
        if (!parsed.some((v) => v.startsWith(formData?.programme + "|"))) {
          parsed.push(`${formData?.programme}|${time}`);
        }
        localStorage.setItem("pendingDeletes", JSON.stringify(parsed));
        localStorage.setItem("backup", formData?.programme);
        setLoading(false);
        onClose();
      }
    } catch (error) {
      alert("Unstable, ",error);
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Overlay />
      <Hosting ref={popupRef}>

        {/* ── Header ── */}
        <ModalHeader>
          <TitleGroup>
            <div className="icon-wrap">
              <i className="bx bxs-chalkboard" />
            </div>
            <h2>Host Session</h2>
          </TitleGroup>
          <CloseBtn onClick={onClose}>
            <i className="bx bx-x" />
          </CloseBtn>
        </ModalHeader>

        <Hint>For lecturers and class reps only</Hint>
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

        {/* ── Level + Duration side by side ── */}
        <TwoCol>
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

          <FieldGroup>
            <Label>Duration</Label>
            <Select
              value={formData.duration}
              onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
            >
              <option value="" disabled>Select</option>
              <option value="5">5 min</option>
              <option value="10">10 min</option>
            </Select>
          </FieldGroup>
        </TwoCol>

        {/* ── Submit ── */}
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <img src={loader} alt="Loading" style={{ width: 22, height: 22 }} />
          ) : (
            <>
              <i className="bx bx-broadcast" />
              Start Session
            </>
          )}
        </SubmitBtn>

      </Hosting>
    </>
  );
}

export default HostForm;
