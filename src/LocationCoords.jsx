import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import 'boxicons/css/boxicons.min.css';

const LocationWrapper = styled.div`
  margin-top: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(141, 138, 138, 1);
  border-radius: 50px;
  padding: 5px 20px;
`;

export default function LocationCoords({ locationValues }) {
  const [location, setLocation] = useState(null);
  const [stat, setStat] = useState("Fetching location...");

  // 🔁 rotating messages
  const messages = [
    "Almost locked in… hang tight 📍",
    "Getting a clearer signal…",
    "We’re close — don’t move 😅",
    "Final touches on your location…"
  ];

  const messageIndex = useRef(0);
  const messageInterval = useRef(null);
  const prevLoc = useRef(Infinity);

  useEffect(() => {
    if (!navigator.geolocation) return;

    let watchId = null;
    let retryInterval = null;

    const startMessageRotation = () => {
      if (messageInterval.current) return;

      messageInterval.current = setInterval(() => {
        setStat(messages[messageIndex.current]);
        messageIndex.current =
          (messageIndex.current + 1) % messages.length;
      }, 2000);
    };

    const stopMessageRotation = () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
        messageInterval.current = null;
        messageIndex.current = 0; // ✅ reset
      }
    };

    const startWatch = () => {
      if (watchId !== null) return;
      setStat("Fetching location...");

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (pos.coords.accuracy <= 10 && pos.coords.accuracy < prevLoc.current) {
            const coords = {
              lat: Number(pos.coords.latitude.toFixed(5)),
              lon: Number(pos.coords.longitude.toFixed(5)),
            };

            setLocation(coords);
            locationValues(coords);
            prevLoc.current = pos.coords.accuracy;
            setStat("Location pinned");
            //alert(`Location pinned ${pos.coords.accuracy}`);

            stopMessageRotation();

            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            if (retryInterval) clearInterval(retryInterval);
          } else {
            startMessageRotation(); // 🔥 start rotating here
          }
        },
        (err) => {
          if (err.code === 1) {
            setStat("Turn on location or allow browser permissions");
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
          }
          if (err.code === 3) {
            setStat("Timeout. Refresh page");
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
          }
        },
        { enableHighAccuracy: true, timeout: 120000, maximumAge: 0 }
      );
    };

    startWatch();

    retryInterval = setInterval(() => {
      if (!location) startWatch();
    }, 3000);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (retryInterval) clearInterval(retryInterval);
      stopMessageRotation();
    };
  }, [locationValues, location]);

  return (
    <LocationWrapper>
      <label
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          fontSize: stat.startsWith("Turn") ? "13px" : "16px",
          textAlign: "center"
        }}
      >
        <i
          className="bx bxs-circle"
          style={{ color: location ? "green" : "grey", fontSize: "15px" }}
        />
        {location ? "Location pinned" : stat}
      </label>
    </LocationWrapper>
  );
        }
