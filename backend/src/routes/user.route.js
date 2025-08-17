import express from 'express';
import { deleteUser, getAuthUser, getUser, listUsers, updateUser } from '../controllers/user.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateUpdateUser } from '../middleware/requests/updateUserValidation.js';
import { validateRequest } from '../middleware/requests/validateRequest.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', authenticateUser, listUsers);
router.get('/me', authenticateUser, getAuthUser);
router.put('/me', authenticateUser, upload.single('avatar'), validateUpdateUser, validateRequest, updateUser);
router.delete('/me', authenticateUser, deleteUser);
router
    .route('/:id')
    .all(authenticateUser)
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);


export default router;
