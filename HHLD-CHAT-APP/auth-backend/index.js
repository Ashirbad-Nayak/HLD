import express from 'express'
import dotenv from "dotenv"
import authrouter from './routes/auth.route.js';
import usersRouter from './routes/users.route.js';
import connectToMongoDB from './db/MongoDBConnection.js';
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();

//middlewares: all middlewares will receive req and resposne object as input, and will pass them to next handlers
app.use(cors({
    credentials: true,
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`] //to set jwt in cookie
}));
app.use(express.json());  //converts req body to json if needed
app.use(cookieParser());
app.use('/auth',authrouter); 
app.use('/users',usersRouter); 


// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks! ');
});

// Start the server
app.listen(PORT, () => {
    connectToMongoDB();
  console.log(`Server is listening at http://localhost:${PORT}`);
});
