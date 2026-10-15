import React, { useEffect, useRef, useState } from "react";

const COUNTDOWN_START = 5;

const css = `
.pi-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.55);
  animation: pi-fade 0.2s ease-out;
}
.pi-card {
  width: 100%;
  max-width: 380px;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.pi-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: 20px;
}
.pi-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}
.pi-body {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 20px;
  color: #334155;
}
.pi-body strong {
  font-weight: 700;
  color: #0f172a;
}
.pi-btn {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 16px;
  background: #16a34a;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}
.pi-btn:focus-visible {
  outline: 3px solid rgba(22, 163, 74, 0.45);
  outline-offset: 2px;
}
.pi-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
@keyframes pi-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .pi-overlay { animation: none; }
}
`;

/**
 * Take Note modal (web).
 *
 * Tells the user that allowing the location permission is mandatory for
 * taking attendance. The "Okay" button stays disabled for a 5-second
 * countdown so the message actually gets read.
 *
 * Props:
 *  - visible: boolean      controls modal visibility
 *  - onClose: () => void   called when the user clicks Okay after the countdown
 */
export default function PermissionInfo({ visible, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_START);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(COUNTDOWN_START);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  // Move focus to the button once it becomes clickable.
  useEffect(() => {
    if (visible && secondsLeft === 0) btnRef.current?.focus();
  }, [visible, secondsLeft]);

  // Lock page scroll while the modal is open.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const disabled = secondsLeft > 0;

  return (
    <>
      <style>{css}</style>
      <div className="pi-overlay">
        <div
          className="pi-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pi-title"
          aria-describedby="pi-body"
        >
          <div className="pi-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 className="pi-title" id="pi-title">Take Note</h2>
          <p className="pi-body" id="pi-body">
            Please <strong>allow</strong> the <strong>location permission</strong> when your
            browser asks. It is <strong>mandatory</strong>, because your location is needed to
            verify your position and take your <strong>attendance</strong>. If you decline,
            you <strong>won't be able to check in</strong>.
          </p>

          <button
            ref={btnRef}
            type="button"
            className="pi-btn"
            onClick={onClose}
            disabled={disabled}
          >
            {disabled ? `Okay, I understand (${secondsLeft})` : "Okay, I understand"}
          </button>
        </div>
      </div>
    </>
  );
}

/* Usage:
 *
 * import { useState } from "react";
 * import PermissionInfo from "./PermissionInfo";
 *
 * function CheckIn() {
 *   const [showNote, setShowNote] = useState(true);
 *   return (
 *     <>
 *       <PermissionInfo
 *         visible={showNote}
 *         onClose={() => {
 *           setShowNote(false);
 *           navigator.geolocation.getCurrentPosition(onSuccess, onError);
 *         }}
 *       />
 *       ...
 *     </>
 *   );
 * }
 */
