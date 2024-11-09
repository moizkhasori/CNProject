import { Box, Typography, AppBar, Toolbar, List, ListItem, ListItemText, Divider, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {io} from "socket.io-client"

const ChatPage = () => {

    const socket = io("http://localhost:4000");
    const location = useLocation();


    const [userSocketId, setUserSocketId] = useState("")
    const [username, setUsername] = useState("")
    const [allUsers, setAllUsers] = useState({})


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
                setAllUsers({data});
                console.log(allUsers, "allUsers");

                const other = Object.keys(data).map(key => ({
                    [key]: data[key]
                  }));

                  const filterArray = other.filter((user) => {
                    const key = Object.keys(user)[0];  
                    return key !== username;
                  });
                  console.log(filterArray, "filterarray");

                
            })
          })
      
      
          return () => {
              socket.disconnect();
          };
    }
   },[username])




    const users = ['User 1', 'User 2', 'User 3'];
  const messages = [
    { sender: 'User 1', text: 'Hello!', alignment: 'left' },
    { sender: 'User 2', text: 'Hi there!', alignment: 'right' },
    { sender: 'User 1', text: 'How are you?', alignment: 'left' },
    { sender: 'User 2', text: 'I am good, thanks!', alignment: 'right' }
  ];

  return (
        <div></div>
  );
};

export default ChatPage