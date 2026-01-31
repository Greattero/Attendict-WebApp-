import styled from "styled-components";
import 'boxicons/css/boxicons.min.css';

const HomePage = styled.div`
  @media screen and (max-width: 650px) {
    min-height: 75svh;     /* mobile-safe height */
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 👈 key */
    background-color: #dbdbdb;
    // padding-top: 1rem;     /* safe spacing */
    width: 100%;
  }

`;


const Buttons = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 6rem;
    width:100%;
    //padding-top:2rem;
    //background-color: red;

  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //gap: 2rem;
    margin-top: -5px;
    background-color: red;
    
  }
`;


const Host = styled.button`
    width: 25rem;
    height: 11rem;
    border-radius: 20px;
    border:none;
    box-shadow: 2.5px 2.5px 2.5px var(--border-white);
    background-color:rgb(236, 238, 243);
        
    i{
    margin-top: 30px;
    font-size: 30px;
    color: grey;
     margin: 10px;
    }

 @media screen and (max-width: 650px) {
    width: 80%;
    height: 8.8rem;
    // margin-top: -230px;
    border-radius: 6px;

        i{
    margin-top: 30px;
    font-size: 30px;
    color: grey;
     margin: 10px;
    }

        h2{
        margin-top: 20px;
        font-size: 25px;
        }
    
        // button{
        // border-radius:100px;
        // border: none;
        // background-color:rgb(230, 230, 230);
        // margin-top: 20px;
       
        // }

  }

`
const CheckIn = styled.button`
    width: 25rem;
    height: 11rem;
    border-radius: 20px;
    border:none;
    box-shadow: 2.5px 2.5px 2.5px var(--border-white);
    background-color:rgb(236, 238, 243);

        i{
        margin-top: 30px;
        font-size: 35px;
        color: grey;
        margin:10px;
        text-align: center;
        }

    @media screen and (max-width: 650px) {
        width: 80%;
        height: 8.8rem;
        // margin-top: -70px;
        border-radius: 6px;


        i{
        margin-top: 30px;
        font-size: 35px;
        color: grey;
        margin:10px;
        text-align: center;
        }

        h2{
        margin-top: 20px;
        font-size: 25px;
        }
    
        // button{
        // border-radius:100px;
        // border: none;
        // background-color:rgb(230, 230, 230);
        // margin-top: 25px;
       
        // }

  }
`

const Remove = styled.button`
    width: 25rem;
    height: 11rem;
    border-radius: 20px;
    border:none;
    box-shadow: 2.5px 2.5px 2.5px var(--border-white);
    background-color:rgb(236, 238, 243);

        i{
        margin-top: 30px;
        font-size: 35px;
        color: grey;
        margin:10px;
        text-align: center;
        }

    @media screen and (max-width: 650px) {
        width: 80%;
        height: 8.8rem;
        // margin-top: -70px;
        border-radius: 6px;


        i{
        margin-top: 30px;
        font-size: 35px;
        color: grey;
        margin:10px;
        text-align: center;
        }

        h2{
        margin-top: 20px;
        font-size: 25px;
        }
    
        // button{
        // border-radius:100px;
        // border: none;
        // background-color:rgb(230, 230, 230);
        // margin-top: 25px;
       
        // }

  }
`

const IconWrapper = styled.div`
  border-radius: 100px;
  background-color: rgb(230, 230, 230);
  width: fit-content;
  padding: 5px;
  margin: auto;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

`;

const Notice = styled.label`
  position: absolute;
  text-align: center;
  font-size: 18px;
  border: 2px solid #ffe4bd;
  border-radius: 15px;
  background-color: #f0d1ae;
  //padding: 15px;
  margin-top: 2rem;
  color: black;
  width: 85rem; /* Matches total width of Host + CheckIn + gap */

  @media screen and (max-width: 650px) {
    width: 75%;
    margin-top: 490px;
    text-align: center;
    padding: 7px;
    // margin-left: -10.7rem;
  }
`;

function Home({onButtonClick, disabled, getWhoIAm}){

    return(
        <HomePage>
            <Buttons>
              {getWhoIAm === "rep" && <Host onClick={!disabled ? () => onButtonClick("host") : () => alert("A session is ongoing")}>
                    <IconWrapper>
                    <i className='bx bxs-user'></i>
                    </IconWrapper>
                    <h2>Host</h2> 
                </Host>}

              {getWhoIAm === "member" && <CheckIn onClick={!disabled ? () => onButtonClick("checkin") : () => alert("Can't checkin when Host is in session")}>
                    <IconWrapper>
                    <i className='bx bxs-user-check'></i>
                    </IconWrapper>
                    <h2>CheckIn</h2>
                </CheckIn>}

              {getWhoIAm === "rep" && <Remove onClick={!disabled ? () => onButtonClick("remove") : () => alert("A session is ongoing")}>
                    <IconWrapper>
                    <i className='bx bx-block'></i>
                    </IconWrapper>
                    <h2>Remove Session</h2> 
               </Remove>}
      
    
            </Buttons>
            <Notice>⚠️Make sure location is on.</Notice>
        </HomePage>
    )

}


export default Home;















