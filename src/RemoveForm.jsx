import styled, { keyframes } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import loader from "./assets/rolling.svg";
import { apiDelete } from "./apiClient";
import "boxicons/css/boxicons.min.css";

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

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
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
    background: linear-gradient(135deg, #dc2626, #ef4444);
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

  i {
    font-size: 18px;
  }

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

const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;

  i {
    font-size: 18px;
    color: #f97316;
    flex-shrink: 0;
    margin-top: 1px;
  }

  p {
    font-size: 0.82rem;
    color: #92400e;
    font-weight: 600;
    margin: 0;
    line-height: 1.5;
  }
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

  &::placeholder {
    color: #d1d5db;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #dc2626, #ef4444);
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
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

function RemoveForm({ onClose, sendFeedback, sendVisible }) {
  const [loading, setLoading] = useState(false);
  const [progName, setProgName] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!progName) {
      alert("Please fill all required fields.");
      return;
    }
    if (progName.length !== 5) {
      alert("Programme code must be 5 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await apiDelete("/api/delete-collection", {
        collection_name: progName,
      });
      const data = response.data;
      if (!response.ok) {
        alert(data.message || "Delete failed");
        setLoading(false);
        return;
      }
      sendVisible(true);
      sendFeedback("removeSession");
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Overlay />
      <Modal ref={popupRef}>
        {/* ── Header ── */}
        <ModalHeader>
          <TitleGroup>
            <div className="icon-wrap">
              <i className="bx bx-trash" />
            </div>
            <h2>Remove Session</h2>
          </TitleGroup>
          <CloseBtn onClick={onClose}>
            <i className="bx bx-x" />
          </CloseBtn>
        </ModalHeader>

        <Hint>Strictly for course reps and lecturers</Hint>
        <Divider />

        {/* ── Warning ── */}
        <WarningBanner>
          <i className="bx bxs-error" />
          <p>
            This will permanently end the active session and clear all check-in
            data for the course.
          </p>
        </WarningBanner>

        {/* ── Course code ── */}
        <FieldGroup>
          <Label>Programme Initials & Course Code</Label>
          <Input
            type="text"
            value={progName}
            onChange={(e) => setProgName(e.target.value.toUpperCase())}
            placeholder="e.g. CE123"
            maxLength={5}
          />
        </FieldGroup>

        {/* ── Submit ── */}
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <img src={loader} alt="Loading" style={{ width: 22, height: 22 }} />
          ) : (
            <>
              <i className="bx bx-trash" />
              Remove Session
            </>
          )}
        </SubmitBtn>
      </Modal>
    </>
  );
}

export default RemoveForm;
