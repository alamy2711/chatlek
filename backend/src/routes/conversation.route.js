import express from 'express';
import { startConversation } from '../controllers/conversation.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/start', authenticateUser, startConversation);

export default router;
