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

io.on("connection", (socket) => {
    console.log(`${socket.id} connected to server!`);

    
    io.emit("newUser", {newUser: socket.id})

    socket.on('register', ({username}) => {
        

       
        userMap[username] = socket.id;
        // console.log(userMap);
        
        // console.log(`User registered: ${username} with socket ID: ${socket.id}`);
    
        // Optionally, broadcast to all users that a new user has joined
        io.emit('userConnected', userMap);


        
    });

    socket.on('sendMessage', (messageData) => {
        const { sender, text, receiver } = messageData;
                    
        if (receiver) {
          // Emit the message to the receiver
          socket.to(receiver).emit('receiveMessage', messageData);
        } else {
          console.log('Receiver is offline.');
        }
      });
})
