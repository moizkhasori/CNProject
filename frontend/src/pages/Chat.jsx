import { Box, Typography, AppBar, Toolbar, List, ListItem, ListItemText, Divider, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {io} from "socket.io-client"

   

const Chat = () => {

    const socket = io("http://localhost:4000");
    const location = useLocation();


    const [userSocketId, setUserSocketId] = useState("")
    const [username, setUsername] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [clientSocketId, setClientSocketId] = useState(null)
    const [currentMessage, setCurrentMessage] = useState("")
    const [chatMessages, setChatMessages] = useState([]);


   useEffect(() => {
    console.log(location);
    
    if(location.state.username){
        setUsername(location.state.username)
    }
   }, [location])

   useEffect(() => {
    if(username){
        socket.on("connect", () => {

            setUserSocketId(socket.id)
            socket.emit('register', { username: username, socketId: socket.id });

            socket.on("userConnected", (data) => {
                console.log(data,"data");
                // setAllUsers({data});

                const other = Object.keys(data).map(key => ({
                    [key]: data[key]
                  }));

                  const filterArray = other.filter((user) => {
                    const key = Object.keys(user)[0];  
                    return key !== username;
                  });
                  console.log(filterArray, "filterarray");

                  setAllUsers(filterArray)
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

   const handleOtherUserChatClick = (otherUserSocketId) => {
    console.log("list item click!", otherUserSocketId);
    setClientSocketId(otherUserSocketId);
    setChatMessages([]);
   }

   const handleSendMessage = () => {
    if (userSocketId && clientSocketId && currentMessage.trim()) {

        const newMessage = {
        sender: userSocketId,
        receiver: clientSocketId,
        text: currentMessage,
      };

      socket.emit('sendMessage', newMessage);

      // Update local message state
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the message input
      setCurrentMessage('');
    }
  };


  // Sample data for users and messages
  const users = ['User 1', 'User 2', 'User 3'];
  const messages = [
    { sender: userSocketId, text: 'Hello!', reciever: 'left' },
    { sender: 'User 2', text: 'Hi there!', reciever: 'right' },
    { sender: userSocketId, text: 'How are you?', reciever: 'left' },
    { sender: 'User 2', text: 'I am good, thanks!', reciever: 'right' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Navigation {currentMessage}</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box sx={{ width: '200px', borderRight: '1px solid #ddd', p: 2 }}>
          <Typography variant="h6">Users</Typography>
          <List>
            {allUsers.map((user, index) => (
              <ListItem key={index} button onClick={() => handleOtherUserChatClick(Object.values(user)[0])}>
                <ListItemText primary={Object.keys(user)[0]} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Window */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
            {clientSocketId && chatMessages.length  > 0 ? (
                chatMessages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === userSocketId ? 'flex-end' : 'flex-start' ,
                        mb: 1,
                      }}
                    >
                      <Paper sx={{ p: 1, maxWidth: '60%' }} elevation={3}>
                        <Typography variant="body1">{message.text}</Typography>
                      </Paper>
                    </Box>
                  ))
            ) : (
                <Typography>Please Start a chat first</Typography>
            )}
          </Box>

          {/* Bottom Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd', p: 1 }}>
            <Box sx={{ width: '50px', textAlign: 'center' }}>
              <Typography variant="body2">Div Left</Typography>
            </Box>
            <TextField
              variant="outlined"
              placeholder="Enter message"
              fullWidth
              sx={{ mx: 2 }}
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
            <Box sx={{ width: '50px', textAlign: 'center' }}>
              <Typography variant="body2">Div Right</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
