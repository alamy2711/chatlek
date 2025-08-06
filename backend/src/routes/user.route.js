import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { listUsers, getAuthUser, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { validateUpdateUser } from '../middleware/requests/updateUserValidation.js';
import { validateRequest } from '../middleware/requests/validateRequest.js';

const router = express.Router();

router.get('/', authenticateUser, listUsers);
router.get('/me', authenticateUser, getAuthUser);
router.put('/me', authenticateUser, validateUpdateUser, validateRequest, updateUser);
router
    .route('/:id')
    .all(authenticateUser)
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);


export default router;
