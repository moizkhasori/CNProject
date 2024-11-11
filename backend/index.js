import express from "express"
import cors from "cors"
import { Server } from "socket.io";
import {createServer} from "http"
 
const app = express();
app.use(cors({
    origin:"*",
}))

const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*",
        
    }
});

app.use(express.json())


app.get("/", (req,res) => {
    res.send("12")
})

server.listen(4000, () => {
    console.log("server started!");
    
})

const userMap = {};

const room_name = "GroupChat";

// io.on("connection", (socket) => {
//     console.log(`${socket.id} connected to server!`);

    
//     io.emit("newUser", {newUser: socket.id})

//     socket.on('register', ({username}) => {
        

       
//         userMap[username] = socket.id;
//         // console.log(userMap);
        
//         // console.log(`User registered: ${username} with socket ID: ${socket.id}`);
    
//         // Optionally, broadcast to all users that a new user has joined
//         io.emit('userConnected', userMap);


        
//     });

//     socket.on('sendMessage', (messageData) => {
//         const { sender, text, receiver } = messageData;
                    
//         if (receiver) {
//           // Emit the message to the receiver
//           socket.to(receiver).emit('receiveMessage', messageData);
//         } else {
//           console.log('Receiver is offline.');
//         }
//       });
// })








// io.on("connection", (socket) => {
//     console.log(`${socket.id} connected to server!`);

    
//     socket.join(room_name);
//     console.log(`User with socket id - ${socket.id} joined the room!`);

//     socket.to(room_name).emit("user_joined", `${socket.id} joined the group chat!`);

//     socket.on("sendMessage", (messageData) => {
//         const {sender, message} = messageData;

//         io.to(room_name).emit("recieve_message", {
//             sender,
//             message,
//             timestamp: new Date().toISOString(),
//         });
//     });
    
//     socket.on("disconnect", () => {
//         console.log(`User Disconnected: ${socket.id}`);
//         socket.to(room_name).emit("userLeft", `User ${socket.id} has left the group chat!`)
        
//     })
  
   
// })






io.on("connection", (socket) => {
    console.log(`${socket.id} connected to server!`);

    

    socket.on('register', ({username,imageUrl}) => {
        
        userMap[username] = {
            socketId: socket.id,
            imageUrl: imageUrl
        };
        
        // userMap[username] = socket.id;
        io.emit('userConnected', userMap);
        
    });

    socket.on('sendMessage', (messageData) => {
        socket.broadcast.emit("receiveMessage", messageData);
      });
})