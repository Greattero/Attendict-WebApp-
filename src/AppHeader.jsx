import styled from "styled-components";
import CheckInForm from "./CheckInForm.jsx";
import icon from './assets/icon.png';

const Heading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: 80px;
  width: 100%;

  background-color: rgb(241, 239, 239);
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 20px;
  box-shadow: 0 1px 4px grey;
  z-index: 9999;
;


  h1 {
    margin: 0;
    color: black;
    font-size: 24px;
    padding-top: 20px;
    font-family: 'Poppins', sans-serif;
  }

  button {
    background-color: transparent;
    color: #c30707;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-top: 35px;
    padding-right: 5px;
    position: relative;
    z-index: 9999;
    font-size: 100px;
  }

  i {
    font-size: 30px;
    margin-bottom: 18px;
    cursor: pointer;
  }


`;


function AppHeader({onLogout,disableLogout}){

    return(

        <Heading>
            <img src={icon}
                  style={{
                width: 40,
                height: 40,
                marginTop: 25
                  }}
              />
            <button onClick={() => {
                if (!disableLogout) {
                  localStorage.removeItem("username");
                  onLogout();
                } else {
                  alert("📸 Chakam! Nice try 😂 Logout drops in 3 mins—cheaters no dey win!");
                }
              }}>
                      <i className="bx bx-log-out"></i>


            </button>

        </Heading>
    )



}


export default AppHeader;







