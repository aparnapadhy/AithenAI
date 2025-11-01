import express from 'express';
import {protect} from '../middlewares/auth.js'
import {textResponse,imageResponse} from '../controllers/messageController.js'

const messageRouter = express.Router();

messageRouter.post('/text',protect,textResponse);
messageRouter.post('/image',protect,imageResponse);

export default messageRouter;