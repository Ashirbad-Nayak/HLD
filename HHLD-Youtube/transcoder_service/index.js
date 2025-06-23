import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import KafkaConfig from './kafka/kafka.js';
import convertToHLS from './hls/transcode.js';
import s3ToS3 from './hls/s3Tos3.js';


dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const kafkaconfig =  new KafkaConfig()
kafkaconfig.consume("transcode", async(message)=>{
   try {
      console.log("Got data from Kafka:", message);
     
      // Parsing JSON message value
      const value = JSON.parse(message);
     
      // Checking if value and filename exist
      if (value && value.filename) {
          console.log("Filename is", value.filename);
          await s3ToS3(value.filename); 
      } else {
          console.log("Didn't receive filename to be picked from S3");
      }
  } catch (error) {
      console.error("Error processing Kafka message:", error);
      //handle error
  }

})



app.get('/', (req, res) => {
    res.send('HHLD YouTube Transcode service')
 })
 

 app.get('/transcode', (req, res) => {
   s3ToS3(); //to test with postman// actual call happens  after receiving kafka message
   // convertToHLS();
   res.send('Transcoding done')
 })
 
 app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
 })
 