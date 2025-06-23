import express from "express";
// import uploadFileToS3 from "../controllers/upload.controller.js";
import { initializeUpload, uploadChunk, completeUpload, uploadToDb } from "../controllers/multipartupload.controller.js";
import multer from 'multer';
const upload = multer();

const router = express.Router();

// router.post('/', upload.fields([{ name: 'chunk' }, { name: 'totalChunks' }, { name: 'chunkIndex' }]), uploadFileToS3);

// Route for initializing upload
router.post('/initialize', upload.none(), initializeUpload); //upload.none is used, since , we are not sending any file but want to access req.body to get filename

// Route for uploading individual chunks
router.post('/', upload.single('chunk'), uploadChunk);

// Route for completing the upload
router.post('/complete', completeUpload);

router.post('/uploadToDB', uploadToDb);
export default router;