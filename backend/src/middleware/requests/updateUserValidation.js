import { body } from 'express-validator';

export const validateUpdateUser = [
    body('Fullname')
        .optional()
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3 and 50 characters'),

    body('avatar')
        .optional()
        .isURL().withMessage('Profile picture must be a valid image URL')
        .matches(/\.(jpg|jpeg|png|webp)$/i).withMessage('Profile picture must be a valid image file (jpg, jpeg, png, webp)'),
];
