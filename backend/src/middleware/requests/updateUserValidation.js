import { body } from 'express-validator';
import { countryCodes } from '../../utils/countriesUtils.js';

export const validateUpdateUser = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3 and 50 characters'),

    body('avatar')
        .optional(),
        // .isURL().withMessage('Profile picture must be a valid image URL')
        // .matches(/\.(jpg|jpeg|png|webp)$/i).withMessage('Profile picture must be a valid image file (jpg, jpeg, png, webp)'),

    body('gender')
        .isIn(['male', 'female']).withMessage('Gender must be either male or female'),

    body('age')
        .notEmpty().withMessage('Age is required')
        .isInt({min: 18, max: 100}).withMessage('Age must be between 18 and 100'),

    body("country")
        .notEmpty().withMessage("Country is required")
        .isIn(countryCodes).withMessage("Invalid country code"),
];
