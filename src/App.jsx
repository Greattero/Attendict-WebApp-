import Home from "./Home.jsx";
import HostForm from "./HostForm.jsx"
import React, {useState} from "react"
import CheckInForm from "./CheckInForm.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import Login from "./Login.jsx";
import AppHeader from "./AppHeader.jsx";
import './index.css';




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


  React.useEffect(() => {
    const interval = setInterval(async () => {
      const raw = localStorage.getItem("pendingDeletes");
      if (!raw || raw === "undefined") return;

      const parsed = JSON.parse(raw); // ARRAY

      console.log("AAAA: ", parsed);

      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const FIVE_MIN = 50000;

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

          console.log("HostForm did it:", programme);
        } catch (err) {
          console.log("Hmmm:", err);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleLock = () => {
    setDisable(true);
    setShowPop(false);
  }
  const handleUnlock = () => {
    setDisable(false);
    setShowPop(true);
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
    }}>

      {/* <div>
        <Sidebar/>
      </div> */}
      
      <div style={{ // New wrapper div
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "250px",
      }}>
        <Home onButtonClick={(type)=>handleButtonClick(type)} disabled={disable}/> {/* Remove all styles from Home */}
        {showPop && (
          <>
            <Overlay isVisible={showPop} />
        
            {/* HostForm popup */}
            {form === "host" && !disable && (
              <HostForm 
                onClose={closeForm} 
                setHostTime={setHostTime} 
                setProgramme={setProgramme} 
              />
            )}
        
            {/* CheckInForm popup */}
            {form === "checkin" && (
              <CheckInForm 
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
      <Login onLoginSuccess={()=>handleLoginSuccess()}/>
    </div>
    
  
}

export default App;
