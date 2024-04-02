import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import { addToken } from "store/db";
import { useNavigate } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import IconEye from "assets/images/icons-eye.svg";
import IconEyeUn from "assets/images/icon-eye-un.svg";
import IconMessage from "assets/images/icon-message.png";
import "./chooseAuth.scss";
import IconArrow from "assets/images/icon-arrow.svg";
import EmailIcon from "assets/images/Information.png";
import PhoneIcon from "assets/images/mobile-alt.png";
import "./sendsms.scss"
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
    const signIn = useSignIn()
    const [passwordType, setPasswordType] = useState("password");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [byEmail, setByEmail] = useState<boolean>(true)
    const [is2fa, setIs2fa] = useState<boolean>(false)
    const [loginActive, setLoginActive] = useState<boolean>(true)
    const [authSelection, setAuthSelection] = useState<boolean>(false)
    const [error2fa, setError2fa] = useState<string>()
    const [errorLogin, setErrorLogin] = useState<string>()
    const [showError, setShowError] = useState<boolean>(false)
    const [showLoginError, setShowLoginError] = useState<boolean>(false)
    const [resendSms, setResendSms] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate();

    const togglePassword = () => {
      if (passwordType === "password") {
        setPasswordType("text");
        return;
      }
      setPasswordType("password");
    };

    const resend2fa = () => {
      setIs2fa(false)
      setAuthSelection(true)
    }

    useEffect(() => {
      if (resendSms) handleLogin()
    },[resendSms])

    let handleLogin = async (e?: any) => {
      setLoading(true)
      if (e) e.preventDefault()
      let data: any
      // if (resendSms) {
      //   data = {
      //     code: "371",
      //     telephone: phone,
      //     password: password,
      //   }
      // } else 
      if (byEmail) {
        data = {
          email: email,
          password: password
        }
      } else {
        data = {
          telephone: phone,
          password: password
        }
      }
      if (resendSms) data.resend = "sms"
      if (is2fa) data.twoFA = code
      const token = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data)
      .then(function(response) {
          return response.data
      })
      .catch(function(error) {
          setLoading(false)
          console.log("axios error", error)
          if (error?.response?.data?.error?.includes("invalid_code")) {
            setError2fa("Invalid code")
            setShowError(true)
          } else if (error?.response?.data?.message?.includes("Unauthorized")) {
            setErrorLogin("Invalid credentials")
            setShowLoginError(true)
          }
      })
      if (token?.twoFA == "two_fa_required") {
        // setEmail(token.email)
        // setPhone(token.telephone)
        setLoginActive(false)
        setLoading(false)
      } else if (token?.token) {
        if(signIn({
            auth:{ token: token.token,type:'Bearer'},
            userState:{
                email: email
            }
        })) {
            await addToken(token.token)
            setLoading(false)
            navigate("/events");
        }
      }
      setLoading(false)
    }

    
    if (loginActive) {
      return (
        <div className="login">
          <div className="login__content">
            <h3 className="login__title">Pieslēgties</h3>
            <div className="chooseOneOf">
            <button className={byEmail ? "email active" : "email"} onClick={() => setByEmail(true)}><h3>ar e-pastu</h3></button>
            <button className={byEmail ? "phone" : "phone active"} onClick={() => setByEmail(false)}><h3>ar telefona numuru</h3></button>
            </div>
            <div className="login__form">
              {showLoginError && <p style={{color: "red"}}>{errorLogin}</p>}
              <form onSubmit={handleLogin}>
                {!byEmail && <><h4 className="input-title">Telephone</h4>
                <input 
                  className="input-email" 
                  type="text"
                  placeholder="Telephone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}/></> }
                {byEmail && <><h4 className="input-title">E-pasts</h4>
                <input 
                  className="input-email" 
                  type="email" 
                  placeholder="E-pasts" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/></> }
                <h4 className="input-title">Parole</h4>
                <div className="password">
                  <input
                    type={passwordType}
                    name="password"
                    className="input-password"
                    placeholder="Parole"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={togglePassword} type="button" className="btn-eye">
                    {passwordType === "password" ? (
                      <img src={IconEyeUn} alt="icon eye" />
                    ) : (
                      <img src={IconEye} alt="icon eye" />
                    )}
                  </button>
                </div>
                <a href={`${process.env.REACT_APP_API_BASE_URL}/forgot-password`}><p className="forgotPassword">Aizmirsāt paroli?</p></a>
                <button className="btn-submit" disabled={loading} type="submit">
                  {loading &&  <CircularProgress
                    size={24}
                    sx={{
                      color: '#fff',
                      position: 'absolute'
                    }}
                  />}
                  Pieslēgties
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    } else if (authSelection) {
      return (
        <div className="chooseAuth">
          <h2 className="title">Norādiet veidu kā vēlaties saņemt drošības kodu</h2>
          <p className="description">
            Izvēloties saņemšanas veidu, Jums uzreiz tiks nosūtīts drošības kods, kuru ievadot varēsiet
            ielogoties savā kontā
          </p>
          <div className="buttons">
            <button type="button" onClick={() => {
              setByEmail(false)
              setResendSms(true)
              setAuthSelection(false)
            }} className="phoneButton">
              <p>
                <img src={PhoneIcon} alt="phoneIcon" /> Nosūtīt kā SMS
              </p>{" "}
              <img src={IconArrow} alt="IconArrow" />
            </button>
            <button type="button" onClick={() => {
              setByEmail(true)
              setResendSms(false)
              setAuthSelection(false)
              handleLogin()
            }} className="emailButton">
              <p>
                <img src={EmailIcon} alt="EmailIcon" /> Nosūtīt e-pastā
              </p>{" "}
              <img src={IconArrow} alt="IconArrow" />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="sendsms">
          <img className="iconMessage" src={IconMessage} alt="icon sms" />
          <h2 className="title">{resendSms ? "Mēs nosūtījām jums SMS" : "Lūdzu pārbaudiet savu e-pasta pastkasti" }</h2>
          <p className="description">{resendSms ? "Lai ielogotos, ievadiet 4 ciparu droršības kodu, ko nosūtījām uz jūsu telefonu" : "Lai ielogotos, ievadiet 4 ciparu droršības kodu, ko nosūtījām uz adresi"} <span>{resendSms ? phone : email}</span></p>
          <div className="form">
            <span className="checkSms">Ievadiet 4 ciparu drošības kodu</span>
            <form onSubmit={handleLogin}>
              {showError && <p style={{color: "red"}}>{error2fa}</p>}
              <input 
                  className="inputCode" 
                  type="text"
                  placeholder="Ievadiet kodu šeit" 
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value) 
                    setIs2fa(true)
                }}/>
              <button type="submit" disabled={loading}>
                Apstiprināt
                {loading &&  <CircularProgress
                    size={24}
                    sx={{
                      color: '#fff',
                      position: 'absolute'
                    }}
                  />}
                </button>
            </form>
            {resendSms && <p className="checkSpamFolder">Nesaņēmāt e-pastu? Pārbaudiet savu SPAM iesūtni</p>}
            <p onClick={resend2fa} className="smsCode"><a>Nosūtīt kodu vēlreiz</a></p>
          </div>
        </div>
      );
    }
    
    
};

export default Login;