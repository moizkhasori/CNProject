import { Button, Container, TextField, Typography, Box } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UserCredentials = () => {

    const [username, setUsername] = useState("Default");
    const [image, setImage] = useState(null);  // State to store the uploaded image file


    const navigate = useNavigate();

    // const handleNavigation = () => {
    //     navigate("/chat2", {state: {username}})
    // }

    // const handleUsernameChange = (e) => {
    //     setUsername(e.target.value)
    // }



    const handleNavigation = () => {
        // Convert image to a URL to pass it as a string
        const imageUrl = image ? URL.createObjectURL(image) : null;
        navigate("/chat2", { state: { username, imageUrl } });
    };

    // Update username as user types
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    // Handle file upload
    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

  return (
    // <Container
    // sx={{
    //     height:"100vh",
    //     bgcolor:"#F5F5F5",
    //     display:"flex",
    //     flexDirection:"column",
    //     justifyContent:"center",
    //     alignItems:"center",
    //     gap:"1rem"
    // }}
    // >
    //     <Typography>{username}</Typography>
    //     <TextField
    //         placeholder='Enter username'
    //         onChange={handleUsernameChange}
    //     />
    //     <Button
    //     variant='contained'
    //     onClick={handleNavigation}
    //     >Click</Button>

    // </Container>

    <Container
    sx={{
        height: "100vh",
        bgcolor: "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "1rem"
    }}
>
   <Typography variant='h1' sx={{mt:10}}>CHAT APP</Typography>
   <Typography>please enter your username and upload an image below</Typography>

   <Box sx={{display:"flex", flexDirection:"column", gap:2, mt:10}}>
    <TextField
        placeholder='Enter username'
        onChange={handleUsernameChange}
    />
    <Button variant="contained" component="label">
        Click To Upload Profile Image
        <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
        />
    </Button>
    <Button
        variant='contained'
        onClick={handleNavigation}
        color='success'
    >
        Enter Chat
    </Button>
   </Box>
</Container>
  )
}

export default UserCredentials