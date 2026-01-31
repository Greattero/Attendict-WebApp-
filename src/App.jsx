import Home from "./Home.jsx";
import HostForm from "./HostForm.jsx"
import React, {useState, useEffect} from "react"
import CheckInForm from "./CheckInForm.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import Login from "./Login.jsx";
import AppHeader from "./AppHeader.jsx";
import RemoveForm from "./RemoveForm.jsx";
import LocationCoords from "./LocationCoords.jsx";
import './index.css';
import "./myStyling.css";




const Overlay = ({ isVisible }) => (
  isVisible ? (
    <div style={{
      margin: "0",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "var(--black-op)",
      zIndex: "1000",
      position: "fixed",
      width: "100%",
      height: "100vh",
    }} />
  ) : null
);


function App() {
  const [login, setLogin] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [showPop, setShowPop] = useState(false);
  const [form, setForm] = useState("");

  const [hostTime, setHostTime] = useState("");

  const [disable, setDisable] = useState(false);

  const [programme, setProgramme] = useState("");

  const [logoutDisable, setLogoutDisable] = useState(false);

  const [toastY, setToastY] = useState(-100); // starts off-screen

  const [visible, setVisible] = useState(false);

  const [feedback, setFeedBack] = useState();

  const [myLocation, setMyLocation] = useState();

  const [person, setPerson] = useState("");


  // console.log("DDD:", programme);

  const successFeedbacks = ["hostedSucessfully", "correctLogs", "checkedinCorrectly", "sessionExists", "alreadyCheckedin", "removeSession", "noSession"];

  const isSuccess = successFeedbacks.includes(feedback);

  const APP_VERSION = "5"; // bump this to force logout

  const storedVersion = localStorage.getItem("app_version");

  if (storedVersion !== APP_VERSION) {
  localStorage.setItem("isLoggedIn", "false"); // force logout
  localStorage.setItem("app_version", APP_VERSION);
  setLogin(false);
  window.location.reload();
}



    useEffect(() => {
        if (!visible) return;

        // Slide in
        setToastY(20);

        const timer = setTimeout(() => {
            // Slide out
            setToastY(-100);
            // Hide after animation
            setTimeout(() => setVisible(false), 500); 
        }, 2000);

        return () => clearTimeout(timer);
    }, [visible]);


  React.useEffect(() => {
    const interval = setInterval(async () => {
      const raw = localStorage.getItem("pendingDeletes");
      if (!raw || raw === "undefined") return;

      const parsed = JSON.parse(raw); // ARRAY

      // console.log("AAAA: ", parsed);

      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const FIVE_MIN = 11 * 60 * 1000; // 300,000 ms

      for (const item of parsed) {
        const [programme, time] = item.split("|");

        // ⏱️ not yet time
        if (Date.now() - Number(time) < FIVE_MIN) return;

        try {
          await fetch("https://attendict.onrender.com/api/delete-collection", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collection_name: programme }),
          });

          // remove ONLY the processed item
          const updated = parsed.filter(v => v !== item);
          localStorage.setItem("pendingDeletes", JSON.stringify(updated));
          // console.log("App did it");

          //console.log("App did it:", programme);
        } catch (err) {
          //console.log("Hmmm:", err);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleLock = () => {
    setDisable(true);
  }
  const handleUnlock = () => {
    setDisable(false);
  }

  const handleButtonClick = (type) => {
    setShowPop(true);
    setForm(type);
  }

  const closeForm = ()=>{
    setShowPop(false);
  }

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setLogin(true);
  };

  const handleLogoutSuccess = () => {
    localStorage.setItem("isLoggedIn", "false");
    setLogin(false);
  };


  return login ? (
    <div style={{
      display: "flex", 
      width: "100vw", // Use vw instead of % for full viewport width
      height: "100vh",
              flexDirection: "column", 

      
    }}>
       {/* <div style={{ // New wrapper div
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // paddingBottom: "30px",
      }}>
          <LocationCoords/>
      </div> */}

      {/* <div>
        <Sidebar/>
      </div> */}

    {visible && (
    <div
        className="toast"
        style={{
            transform: `translateY(${toastY}px)`,
            transition: 'transform 0.5s ease',
        }}
    >

        {!isSuccess ? "❌" : "✅"}
        <label style={{
            marginLeft: "15px",
            marginTop: "2px",
        }}>
                    {feedback === "hostedSucessfully" ? "Created session successfully" 
                    : feedback === "correctLogs" ? "Logged in successfully"
                    : feedback === "checkedinCorrectly" ? "Checked in successfully" 
                    : feedback === "sessionExists" ? "Session already exists"
                    : feedback === "alreadyCheckedin" ? "You've already checked in"
                    : feedback === "removeSession" ? "Session removed successfully"
                    : feedback === "noSession" ? "Session doesn't exist"
                    : feedback === "newGoogleSignUp" ? "Account created successfully"
                    : feedback === "googleAlreadyExists" ? "Logged in successfully"
                    : feedback === "passwordResetLinkSent" ? "Password reset not successful"
                    : feedback === "emailAlreadyRegistered" ? "Account already exists"
                    : null}
        </label>
    </div>
    )}

      <div style={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
      }}>
                <LocationCoords locationValues={setMyLocation}/>        
      </div>
      
      <div style={{ // New wrapper div
          flex: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",   
          //paddingBottom: "50px",
      }}>
        <Home onButtonClick={(type)=>handleButtonClick(type)} disabled={disable} getWhoIAm={person}/> {/* Remove all styles from Home */}
        {showPop && (
          <>
            <Overlay isVisible={showPop} />
        
            {/* HostForm popup */}
            {form === "host" && !disable && (
              <HostForm 
                onClose={closeForm} 
                getLocation={myLocation}
                setHostTime={setHostTime} 
                setProgramme={setProgramme}
                sendVisible={setVisible}
                sendFeedback={setFeedBack}
              />
            )}

            {form === "remove" && !disable && (
              <RemoveForm 
                onClose={closeForm}
                sendVisible={setVisible}
                sendFeedback={setFeedBack}
              />
            )}
        
            {/* CheckInForm popup */}
            {form === "checkin" && (
              <CheckInForm
                getLocation={myLocation}
                sendVisible={setVisible}
                sendFeedback={setFeedBack}
                onClose={closeForm} 
                disableLogout={setLogoutDisable} 
              />
            )}
          </>
        )}
      </div>
      <div style= {{
        position: "absolute",
        width: "100%",
        top: 0,
      }}>
            <AppHeader onLogout={()=>handleLogoutSuccess()} disableLogout={logoutDisable}/>
      </div>

      <div style= {{
        position: "absolute",
        top: "-10px",
        right: "20px",
        zIndex: 1000,
        paddingRight: "70px",
        paddingTop: "19px",
      }}
      
      >
        <CountdownTimer 
        key={hostTime} 
        hostTime={hostTime} 
        setHostTime={setHostTime} 
        lockCheckin={()=>handleLock()}
        unLockCheckin={()=>handleUnlock()}
        programme={programme}
        resetProgramme={setProgramme}
        />
      </div>

    </div> 
    ) :
    <div style ={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      boxShadow: "0px 0px 30px hsla(0, 41.9%, 42.5%, 0.87)",
      borderRadius: "30px"
      }}>
      <Login 
        sendVisible={setVisible}
        sendFeedback={setFeedBack}
        onLoginSuccess={()=>handleLoginSuccess()}
        sendWhoIAm={setPerson}
        />
        
    </div>
    
  
}

export default App;
