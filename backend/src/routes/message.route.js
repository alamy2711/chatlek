import express from 'express';
import { getMessagesByConversation, sendMessage } from '../controllers/message.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateMessage } from '../middleware/requests/messageValidation.js';
import { validateRequest } from '../middleware/requests/validateRequest.js';

const router = express.Router();

router.get('/conversation/:conversationId', authenticateUser, getMessagesByConversation);
router.post('/conversation/:conversationId', authenticateUser, validateMessage, validateRequest, sendMessage);

export default router;
