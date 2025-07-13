import Home from "./Home.jsx";
import HostForm from "./HostForm.jsx"
import React, {useState} from "react"
import CheckInForm from "./CheckInForm.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import Login from "./Login.jsx";
import AppHeader from "./AppHeader.jsx";
import './index.css';




const Overlay = ({isVisible}) => (
  <div style ={{
    margin: "0",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "var(--black-op)",
    zIndex:"1000",
    display: "block",
    position: "fixed",
  }}/>

)

function App() {
  const [login, setLogin] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [showPop, setShowPop] = useState(false);
  const [form, setForm] = useState("");

  const [hostTime, setHostTime] = useState("");

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
        <Home onButtonClick={(type)=>handleButtonClick(type)}/> {/* Remove all styles from Home */}
        {showPop && (<>
          <Overlay isVisible={showPop}/>
          {form === "host" && <HostForm onClose={()=>closeForm()} setHostTime={setHostTime}/>}
          {form === "checkin" && <CheckInForm onClose={()=>closeForm()}/>}
          </>)
          }
      </div>
      <div style= {{
        position: "absolute",
        width: "100%",
        top: 0,
      }}>
            <AppHeader onLogout={()=>handleLogoutSuccess()}/>
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
      <CountdownTimer hostTime={hostTime}/>
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