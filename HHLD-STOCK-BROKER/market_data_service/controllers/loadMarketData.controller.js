import UpstoxClient from "upstox-js-sdk";
import getMarketDataFeed from "../marketDataAPI/getMarketData.js";

const loadMarketData = async (req, res) => {
   try {
       getMarketDataFeed();
       return res.status(200).json({ message: 'Data received' });
   } catch (error) {
       console.log('Error in loading market data : ', error.message());
       return res.status(500).json({ message: 'Server error' });
   }
}

export default loadMarketData;


export const getDataMonthlyInterval = async (req, res) => {
    const instrumentKey = req.query.instrumentKey;
    let apiVersion = "2.0";
    let interval = "month";
    let toDate = "2025-05-25";
    let fromDate = "2024-03-25";

    console.log('instrumentKey', instrumentKey,',')
    let apiInstance = new UpstoxClient.HistoryApi();
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = process.env.ACCESS_TOKEN;

    apiInstance.getHistoricalCandleData1(instrumentKey, interval, toDate, fromDate, apiVersion, (error, data, response) => {
        if (error) {
            console.log(error);
            res.status(500).json({"error": error})
        } else {
            res.status(200).json({"data": data.data})
        }
    });
}