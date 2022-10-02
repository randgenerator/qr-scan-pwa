import React, { useState } from "react";
import axios from "axios";
import "./style.scss";
import { addToken } from "store/db";
import { useNavigate } from "react-router-dom";
import { useSignIn } from 'react-auth-kit'
import IconEye from "assets/images/icons-eye.svg";
import IconEyeUn from "assets/images/icon-eye-un.svg";

const Login = () => {
    const signIn = useSignIn()
    const [passwordType, setPasswordType] = useState("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const togglePassword = () => {
        if (passwordType === "password") {
          setPasswordType("text");
          return;
        }
        setPasswordType("password");
      };

    let handleLogin = async (e: any) => {
        
        e.preventDefault();
        const token = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
            email: email,
            password: password
        })
        .then(function(response) {
            return response.data
        })
        .catch(function(error) {
            console.log("axios error", error)
        })
        
        if(signIn({token: token.token,
            expiresIn: token.expires_in / 60,
            tokenType: "Bearer",
            authState: {email: email}
        })) {
            await addToken(token.token)
            navigate("/events");
        }
        
    }

    
    return (
        <div className="login">
          <div className="login__content">
            <h3 className="login__title">Pieslēgties</h3>
            <div className="login__form">
              <form onSubmit={handleLogin}>
                <h4 className="input-title">E-pasts</h4>
                <input 
                  className="input-email" 
                  type="email" 
                  placeholder="peteris.kalnins@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>
                <h4 className="input-title">Password</h4>
                <div className="password">
                  <input
                    type={passwordType}
                    name="password"
                    className="input-password"
                    placeholder="Password"
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
                <p className="forgotPassword">Aizmirsāt paroli?</p>
                <button className="btn-submit" type="submit">
                  Pieslēgties
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    
};

export default Login;