
import express from "express"
import loadMarketData, { getDataMonthlyInterval } from "../controllers/loadMarketData.controller.js"

const router = express.Router();

router.get('/', loadMarketData);
router.get('/getDataMonthlyInterval', getDataMonthlyInterval);


export default router;