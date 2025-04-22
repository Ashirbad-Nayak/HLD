import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import getUsers from '../controllers/user.controller.js';

const router = express.Router();

router.get('/',verifyToken, getUsers);

export default router; //can be used as middle ware in index.js