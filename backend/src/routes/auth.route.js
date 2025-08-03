import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { validateLogin, validateSignup } from '../middleware/authValidation.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/signup', validateSignup, validateRequest, signup);
router.post('/login', validateLogin, validateRequest, login);
router.post('/logout', logout);

export default router;
