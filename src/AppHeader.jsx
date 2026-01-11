import styled from "styled-components";
import CheckInForm from "./CheckInForm.jsx";
import icon from './assets/icon.png';

const Heading = styled.div`
  background-color: rgb(241, 239, 239);;
  margin-top: -25px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 9999;
  box-shadow: 0.5px 0.5px 0.5px 0.5px grey;


  h1 {
    margin: 0;
    color: black;
    font-size: 24px;
    padding-top: 20px;
    font-family: 'Poppins', sans-serif;
  }

  button {
    background-color: transparent;
    color: red;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-top: 35px;
    position: relative;
    z-index: 9999;
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
                          <i class="bx bxs-arrow-out-right-square-half" style="color:#b0b0b0;" />

            </button>

        </Heading>
    )



}


export default AppHeader;







