import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import uploadRouter from './routes/upload.route.js'
import kafkaPublisherRouter from './routes/kafkaPublisher.route.js'

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/upload',uploadRouter);
app.use('/publish',kafkaPublisherRouter);




app.get('/', (req, res) => {
    res.send('HHLD YouTube')
 })
 
 
 app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
 })
 