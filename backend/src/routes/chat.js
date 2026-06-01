import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Chat routes can be used by both USER and CAPTAIN
router.use(authMiddleware()); 

router.get('/:serviceRequestId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

export default router;
