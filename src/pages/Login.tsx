import React, { useState } from "react";
import axios from "axios";
import { addToken } from "../store/db";
import { useNavigate } from "react-router-dom";
import { useSignIn } from 'react-auth-kit'

const Login: React.FC = () => {
    const signIn = useSignIn()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    
    let handleLogin = async (e: any) => {
        
        e.preventDefault();
        const token = await axios.post("https://pa-test.esynergy.lv/api/v1/auth/login", {
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
            tokenType: "Bearer"
        })) {
            await addToken(token.token)
            navigate("/events");
        }
        
    }
    
    return (
    <>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <input 
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                value={password}
                placeholder="Email"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    </>
    )
    
};

export default Login;