import express from "express"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io";
import cors from "cors";
import connectToMongoDB from "./db/MongoDbConnection.js";
import { addMsgToConversation } from "./controllers/msgs.controller.js";
import msgsRouter from './routes/msgs.route.js'
import { subscribe, publish } from "./redis/msgsPubSub.js";


dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);
app.use(cors());
app.use('/msgs', msgsRouter);

const io = new Server(server, {
  cors: {
    allowedHeaders: ["*"],
    origin: "*"
  }
}
);

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log('Client connected');
  const username = socket.handshake.query.username;

  //maintian the map of username to socket in the  be server
  userSocketMap[username] = socket;

  //also subscribe to their resp channel to receive messages from their resp channel
  const channelName = `chat_${username}`
  subscribe(channelName, (msg) => {
    socket.emit("chat msg", JSON.parse(msg));
  });


  console.log("user name: ", username)
  socket.on('chat msg', (msg) => {
    console.log('Received msg: Sender --> ' + msg.sender + ', Receiver --> ' + msg.receiver + ', message -->' + msg.text);
    const receiverSocket = userSocketMap[msg.receiver];

    if (receiverSocket) {
      console.log('Both sender and receiver are connected to same BE server');
      receiverSocket.emit('chat msg', msg);
    } else {
      console.log('Sender & receiver connected to different BE sevrer');
      //publish message to the receiver's channel
      const channelName = `chat_${msg.receiver}`
      publish(channelName, JSON.stringify(msg));
    }

    //save to Mongo DB
    addMsgToConversation([msg.sender, msg.receiver], msg);// know that we have sender , receiver and msg text in msg which confirms to the msgSchema

    // socket.broadcast.emit('chat msg',msg);

  });
});



// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks! ');
});

// Start the server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${PORT}`);
});