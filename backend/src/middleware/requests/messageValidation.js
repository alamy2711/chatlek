import { body } from 'express-validator';

export const validateMessage = [
    body('message')
        .optional()
        .trim()
        .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),

    body('media')
        .optional()
        // .isURL().withMessage('Media must be a valid image URL')
        // .matches(/\.(jpg|jpeg|png|webp)$/i).withMessage('Media must be a valid image file (jpg, jpeg, png, webp)'),
];
