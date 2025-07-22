import styled from "styled-components";
import 'boxicons/css/boxicons.min.css';
import React, {useState, useEffect} from "react";
import loader from './assets/rolling.svg';

const LogBody = styled.div`
    position: relative;
    width: 850px;
    height: 550px;
    background-color: #fff;
    box-shadow: 0 0 30px hsla(0, 2.30%, 42.50%, 0.74);  // ← shadow added here


    p{
        font-size: 14.5px;
        margin: 15px 0;
    }


@media screen and (max-width: 650px){
    height: calc(100vh - 20px);
    margin-top: -20px;
  }
`

const FormBox = styled.form`
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #333;
    text-align: center;
    z-index: 1;

    @media screen and (max-width: 650px){
    background: white;
    bottom: 0;
    width: 100%;
    height: 65%;
    padding-bottom:0px;
  }
`
const Form = styled.div`
    width: 100%;

    h1{
    font-size: 36px;
    margin: -10px 0;
    }

  @media screen and (max-width: 650px) {
    position: absolute;
    width: 95%;
    height: 30%;
    border-radius: 60px 60px 0 0;
    padding-bottom: 300px;

    
  }
    
`

const Input = styled.div`

    input{
        position: relative;
        margin: 20px 0;
        width: 300px;
        padding: 13px 50px 13px 20px;
        border-radius: 8px;
        border: none;
        outline: none;
        background: #eee;
        font-size: 16px;
        color: #333;
        font-weight: 500;

        &::placeholder{
        color: #888;
        }
    }

    i{
    position: absolute;
    right: 50px;
    margin-top: 30px;
    font-size: 20px;
    color: #888;
    }

  @media screen and (max-width: 650px) {
    input{
    width: 50%;
    }

    i{
    margin-top: 35px;
    right: 70px;
    }
  }

`

const Forget = styled.div`
    margin-bottom: 20px;

    a{
        font-size: 17px;
        color: #333;
        text-decoration: none;
    }

`

const Button = styled.button`
    width: 86%;
    height: 48px;
    background: #7494ec;
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, -1);
    cursor: pointer;
    font-size: 16px;
    color: white;
    font-weight: 600;

  @media screen and (max-width: 650px) {
  width: 64%;

  }
    


`

const Social = styled.div`
    font-size: 30px;

    a{
        display: inline-flex;
        border: 2px solid white;
        border-radius: 4px;
        padding: 10px;
        font-size: 24px;
        color: #333;
        text-decoration: none;
    }
`

const Welcome = styled.div`

    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: seagreen;
    color: white;
    border-radius: 0px 150px 150px 0px;

    p{
    font-size: 20px;
    margin-bottom: 20px;
    }

  @media screen and (max-width: 650px) {
    position: absolute;
    width: 101%;
    height: 30vh;
    border-radius: 0px 0px 80px 80px;
    padding-top: 10px;

    p {
      font-size: 14px;
      margin: 10px 0;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
  }

`

// const Input2 = styled.div`
//     input{
//         position: relative;
//         margin: 20px 0;
//         width: 350px;
//         padding: 13px 50px 13px 20px;
//         border-radius: 8px;
//         border: none;
//         outline: none;
//         background: #eee;
//         font-size: 12px;
//         color: #333;
//         font-weight: 500;

//         &::placeholder{
//         color: #888;
//         }
//     }

//     i{
//     position: absolute;
//     right: 20px;
//     margin-top: 30px;
//     font-size: 20px;
//     color: #888;
//     }
// `

function Login({onLoginSuccess}){

    const [loading, setLoading] = useState(false);


    const [loginData, setLoginData] = useState({
        username:"",
        password:"",
    });

    const handleUsername = (e) => {
        setLoginData(
            (prev) => ({...prev, username:e.target.value.toUpperCase()})
        )
    }

    const handlePassword = (e) => {
        setLoginData(
            (prev) => ({...prev, password: e.target.value.toUpperCase()})
        )
    }

    const handleLogin = async (e) => {
        e.preventDefault();

          setLoading(true); // Start loading

        try{
        const res = await fetch("https://attendict.onrender.com/api/login-details",{
            method: "POST",
            headers:{
            "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData),
        })

        const data = await res.json();
        if (data.success){
            localStorage.setItem("username",loginData.username);
            alert("Login Successful🎉");
            onLoginSuccess();
        }
        else{
            alert("Invalid Username or password🥲");
            setLoading(false); // Stop loading

        }
    }
    catch(err){
        alert("No records found");
        console.log(err);
        setLoading(false);
    }
    }



    return(
        <LogBody className="container">
            <FormBox className="form-box Login">
                <Form>
                    <h1>Login</h1>
                    <Input className="input-box">
                        <input type="text" 
                        placeholder="Enter Index Number"
                        value={loginData.username}
                        onChange={(e)=>handleUsername(e)}
                        required/>
                        <i className='bx  bxs-user' ></i> 
                    </Input>
                    <Input className="input-box">
                        <input type="password" 
                        placeholder="Enter password"
                        value={loginData.password}
                        onChange={(e)=>handlePassword(e)}
                        required/>
                        <i className='bx  bxs-lock'></i> 
                    </Input>
                    <Forget className="forgot-link">
                        <a href="#">Forgot Password?</a>
                    </Forget>
                    <Button type="submit" className="btn" onClick={(e)=>handleLogin(e)} disabled={loading}>
                        {loading ? (
                            <img src={loader} alt="Loading" style={{ width: "24px", height: "24px" }} />
                        ) : (
                            "Login"
                        )}
                    </Button>
                    <p>Or login with social platforms</p>
                    <Social className="social_icons">
                        <a href="#"><i className='bx  bxl-google'></i></a>

                    </Social>
                </Form>
            </FormBox>


            <Welcome className="toggle-box">
                <h1>Welcome To Attendict!</h1>

                <p>Take control of your classroom <br/>attendance effortlessly.</p>
            </Welcome>
        
        
        </LogBody>
        
    )
}
export default Login;