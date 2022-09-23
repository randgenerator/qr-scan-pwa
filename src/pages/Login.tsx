import React, { useState } from "react";
import axios from "axios";
import { addToken } from "../store/db";
import { useNavigate } from "react-router-dom";
import { useSignIn } from 'react-auth-kit'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import FormControl from "@mui/material/FormControl";

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
    <Box 
    sx={{ 
        width:'50%', 
        justifyContent: 'center',
        margin: 'auto' }}>
        <h1>Login</h1>
        <FormControl>
        <form onSubmit={handleLogin}>
        <Stack spacing={2}>
            <TextField id="outlined-basic" 
                label="Email" 
                variant="outlined"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} />
            
            <TextField id="outlined-basic" 
                label="Password" 
                variant="outlined"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" type="submit">Login</Button>
            </Stack>
        </form>
        </FormControl>
    </Box>
    )
    
};

export default Login;