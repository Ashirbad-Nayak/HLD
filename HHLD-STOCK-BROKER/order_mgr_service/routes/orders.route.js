
import express from "express"
import { getOrders , addOrder, cancelOrder} from "../controller.js/orders.controller.js";

const router = express.Router();

router.get('/get', getOrders);
router.post('/add', addOrder);
router.delete('/cancel/:orderId', cancelOrder);

export default router;