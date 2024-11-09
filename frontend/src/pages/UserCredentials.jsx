import { Button, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UserCredentials = () => {

    const [username, setUsername] = useState("Default");

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/chat2", {state: {username}})
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

  return (
    <Container
    sx={{
        height:"100vh",
        bgcolor:"#F5F5F5",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        gap:"1rem"
    }}
    >
        <Typography>{username}</Typography>
        <TextField
            placeholder='Enter username'
            onChange={handleUsernameChange}
        />
        <Button
        variant='contained'
        onClick={handleNavigation}
        >Click</Button>

    </Container>
  )
}

export default UserCredentials