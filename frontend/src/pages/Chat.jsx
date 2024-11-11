import { Box, Typography, AppBar, Toolbar, List, ListItem, ListItemText, Divider, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {io} from "socket.io-client"

   

const Chat = () => {

    const socket = io("http://localhost:4000");
    const location = useLocation();


    const [userSocketId, setUserSocketId] = useState("")
    const [username, setUsername] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [chatMessages, setChatMessages] = useState([]);
    const [image, setImage] = useState("");
    const [sendImage, setSendImage] = useState(null);




   useEffect(() => {
    
    if(location.state){
        setUsername(location.state.username)
        setImage(location.state.imageUrl)
    }
   }, [location])

   useEffect(() => {
    if(username){
        socket.on("connect", () => {

            setUserSocketId(socket.id)
            socket.emit('register', { username: username, imageUrl:image,  socketId: socket.id });

            socket.on("userConnected", (data) => {

              

                const userDataMap = Object.keys(data).map(key => ({
                    [key]: data[key]
                  }));

                  

                  const userDataFilteredMapArray = userDataMap.filter((user) => {
                    const key = Object.keys(user)[0];  
                    
                    return key !== username;
                  });

                  setAllUsers(userDataFilteredMapArray)
                  
            })

            socket.on('receiveMessage', (incomingMessage) => {  
                setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
              });
          })
      
          return () => {
              socket.disconnect();
          };
    }
   },[username])

  //  const handleSendMessage = () => {
  //   if (userSocketId && currentMessage.trim()) {

  //       const newMessage = {
  //       sender: userSocketId,
  //       text: currentMessage,
  //       username: username
  //     };

  //     socket.emit('sendMessage', newMessage);
  //     setCurrentMessage('');

  //   }
  // };


  const openFileInput = () => {
    document.getElementById('fileInput').click();
  };

  // Send message
  const sendMessage = () => {
    handleSendMessage(currentMessage, sendImage);
    setCurrentMessage('');
    setSendImage(null);
  };

  const handleSendMessage = (text, image) => {
    if (!text.trim() && !image) return; // No empty messages
  
    const newMessage = {
      sender: userSocketId,
      text: text || "", // Optional text content
      username: username,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      image: null,
    };
  
    // Handle image upload
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        newMessage.image = reader.result; // base64 image string
        socket.emit('sendMessage', newMessage); // Send message after conversion
        setSendImage(null); // Reset image state after sending
      };
      reader.readAsDataURL(image); // Converts image file to base64 string
    } else {
      socket.emit('sendMessage', newMessage); // Send text-only message if no image
    }
  
    setCurrentMessage(''); // Reset text message
  };
  


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSendImage(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              overflow: "hidden",
            }}
          >
            <img src={image} alt="" />
          </Box>
          <Typography variant="h6">{username}</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Box sx={{ width: "200px", borderRight: "1px solid #ddd", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Online Users
          </Typography>
          <Divider />
          <List>
            {allUsers.map((user, index) => (
              <OnlineUser user={user} />
            ))}
          </List>
        </Box>

        {/* Chat Window */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {chatMessages.length > 0 ? (
              chatMessages.map((message, index) => (
                <ChatMessage
                  message={message}
                  userSocketId={userSocketId}
                  index={index}
                />
              ))
            ) : (
              <Typography>Please Start a chat first</Typography>
            )}
          </Box>

          {/* Bottom Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #ddd",
              p: 1,
            }}
          >
            <Box
              sx={{
                width: "50px",
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={openFileInput}
            >
              <PhotoCamera sx={{ color: "black" }} /> {/* Icon instead of text */}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </Box>

            <TextField
              variant="outlined"
              placeholder="Enter message"
              fullWidth
              sx={{ mx: 2 }}
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
            />
            <IconButton color="primary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;


const OnlineUser = ({ user }) => {
  const username = Object.keys(user)[0];
  const userData = user[Object.keys(user)[0]];
  
  
  return (
    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>

      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2, 
          overflow:"hidden"
        }}
      >
        <img style={{objectFit:"contain"}} src={userData.imageUrl} alt="" />
      </Box>

      <ListItemText
        primary={username}
        sx={{ display: 'flex', alignItems: 'center' }}
      />
    </ListItem>
  );
};



// const ChatMessage = ({ message, userSocketId, index }) => {

//   const currentTime = new Date().toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });


//   return (
//     <Box
//     key={index}
//     sx={{
//       display: "flex",
//       justifyContent: message.sender === userSocketId ? "flex-end" : "flex-start",
//       mb: 1,
//     }}
//   >
//   <Paper sx={{ p: 2, maxWidth: '60%', mb: 2, mr:1 }} elevation={3}>
//         {/* Username */}
//         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color:"blue" }}>
//           {message.username}
//         </Typography>
        
//         {/* Message text */}
//         <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
//           {message.text}
//         </Typography>
        
//         {/* Time (hardcoded for now) */}
//         <Typography variant="caption" sx={{ color: 'gray' }}>
//           {currentTime}
//         </Typography>
//       </Paper>
//   </Box>
//   );
// };



const ChatMessage = ({ message, userSocketId, index }) => {
  console.log(message, "me image");
  
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        justifyContent: message.sender === userSocketId ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper sx={{ p: 2, maxWidth: '60%', mb: 2, mr: 1 }} elevation={3}>

        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: "blue" }}>
          {message.username}
        </Typography>


        {message.text && (
          <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
            {message.text}
          </Typography>
        )}
        {message.image && (
          <Box
            component="img"
            src={message.image}
            alt="Sent image"
            sx={{
              maxWidth: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              mt: 1,
              mb: 1,
              borderRadius: "8px"
            }}
          />
        )}


        <Typography variant="caption" sx={{ color: 'gray' }}>
          {message.time}
        </Typography>
      </Paper>
    </Box>
  );
};
