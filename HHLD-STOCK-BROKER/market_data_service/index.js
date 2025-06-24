
import express from 'express';
import dotenv from "dotenv"
import cors from "cors";
import UpstoxClient from "upstox-js-sdk";
import http from "http"
import {Server} from "socket.io"
import stocksRouter from './routes/stocks.route.js'
import marketDataRouter from './routes/marketData.route.js'
import getMarketDataFeed from './marketDataAPI/getMarketData.js';



dotenv.config();
const app = express();
const port = 4000;
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
 });

 io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('market data', (msg) => {
        console.log('Received msg ' + msg); //instrument keys from client
        getMarketDataFeed(msg, (data)=> {
            socket.emit('market data', data);
        });
    });
 });
 



app.use('/stocks',stocksRouter);
app.use('/marketData', marketDataRouter)





//get auth code
// https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id={Your_ClientID}&redirect_uri=https%3A%2F%2Flocalhost%3A4000

app.get('/', async (req, res) => {ß
   res.json({ message: "HHLD Stock Broker Market Data Service" });
});

//get auth token
app.get('/getDataFromUpstox', (req, res) => {
   loginToUpstox();
   res.json({ message: "Succeeded" });
});

const loginToUpstox = () => {
   const apiInstance = new UpstoxClient.LoginApi();
   const apiVersion = "2.0";
   const opts = {
       code: process.env.AUTH_CODE,
       clientId: process.env.CLIENT_ID,
       clientSecret: process.env.CLIENT_SECRET,
       redirectUri: process.env.REDIRECT_URI,
       grantType: "authorization_code",
   };
   apiInstance.token(apiVersion, opts, (error, data, response) => {
       if (error) {
           console.log("Error occurred: ", error);
       } else {
           console.log('Access Token - ', data["accessToken"]);
           console.log("API called successfully. Returned data: " + JSON.stringify(data)); //this will have auth token. copy that
       }
   });
};






//get OHLC data from market
app.get("/getOHLCData", (req, res) => {
   console.log("Getting OHLC route");
   const symbol = req.query.symbol;
   getMarketQuoteOHLC(symbol, (err, data) => {
       if (err) {
           res.status(500).json("failed")
       } else {
           res.status(200).json(data)
       }
   });
});

const getMarketQuoteOHLC = (symbol, callback) => {
   let defaultClient = UpstoxClient.ApiClient.instance;
   var OAUTH2 = defaultClient.authentications["OAUTH2"];
   OAUTH2.accessToken = process.env.ACCESS_TOKEN;
   let apiInstance = new UpstoxClient.MarketQuoteApi();
   let apiVersion = "2.0";
   //let symbol = "NSE_EQ|INE669E01016";
   let interval = "1d";
   apiInstance.getMarketQuoteOHLC(
       symbol,
       interval,
       apiVersion,
       (error, data, response) => {
           if (error) {
               console.error(error);
               callback(err, null)
           } else {
               console.log(
                   "API called successfully. Returned data: " + JSON.stringify(data)
               );
               callback(null, data)
           }
       }
   );
};


server.listen(port, () => {
   console.log(`Server is listening at http://localhost:${port}`);
})
