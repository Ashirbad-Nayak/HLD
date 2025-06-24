import UpstoxClient from 'upstox-js-sdk';


export const getOrders = (req, res) => {
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = process.env.ACCESS_TOKEN;
    let apiInstance = new UpstoxClient.OrderApi();

    let apiVersion = "2.0";
    
    apiInstance.getOrderBook(apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            res.status(200).json({ message: data });
        }
    });
}


export const addOrder1 = (req, res) => {
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = process.env.ACCESS_TOKEN;

    let apiInstance = new UpstoxClient.OrderApi();
    let body = new UpstoxClient.PlaceOrderRequest(1, UpstoxClient.PlaceOrderRequest.ProductEnum.D, UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY, 0.0, "NSE_EQ|INE669E01016", UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET, UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.BUY, 0, 0.0, true);
    let apiVersion = "2.0";

    apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            res.status(200).json({ message: data });
        }
    });
}

export const addOrder = (req, res) => {
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  
    const {
        quantity,
        product,
        validity,
        price,
        tag,
        instrument_token,
        order_type,
        transaction_type,
        disclosed_quantity,
        trigger_price,
        is_amo
      } = req.body;
  
    try {
      const body = new UpstoxClient.PlaceOrderRequest(
        parseInt(quantity),
        UpstoxClient.PlaceOrderRequest.ProductEnum.D,
        UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY,
        parseFloat(disclosed_quantity),
        instrument_token,
        UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET,
        UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.BUY,
        parseFloat(price) || 0,
        parseFloat(trigger_price),
        Boolean(is_amo)
      );
      console.log("===================================================")
      console.log("Received order request:", req.body, parseFloat(price), body);
      console.log("========================")

  
      const apiInstance = new UpstoxClient.OrderApi();
      const apiVersion = "2.0";
  
      apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
        if (error) {
          console.error("Error placing order:", error);
          res.status(500).json({ error: error.message });
        } else {
          console.log('Order placed successfully:', data);
          res.status(200).json({ message: data });
        }
      });
    } catch (err) {
      console.error("Invalid input:", err);
      res.status(400).json({ error: "Invalid request payload" });
    }
  };
  


export const cancelOrder = (req, res) => {
    let defaultClient = UpstoxClient.ApiClient.instance;
    var OAUTH2 = defaultClient.authentications['OAUTH2'];
    OAUTH2.accessToken = process.env.ACCESS_TOKEN;
    let apiInstance = new UpstoxClient.OrderApi();

    let orderId = req.params.orderId;//"250425000000765";
    let apiVersion = "2.0";

    console.log(`Cancelling order with ID: ${orderId}`);

    apiInstance.cancelOrder(orderId, apiVersion, (error, data, response) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            res.status(200).json({ message: data });
        }
    });
}