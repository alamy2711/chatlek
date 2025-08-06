import { body } from 'express-validator';
import { countryCodes } from '../../utils/countriesUtils.js';

export const validateSignup = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({min: 3, max: 50}).withMessage('Full name must be between 3 and 50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters'),

    body('gender')
        .isIn(['male', 'female']).withMessage('Gender must be either male or female'),

    body('age')
        .notEmpty().withMessage('Age is required')
        .isInt({min: 18, max: 100}).withMessage('Age must be between 18 and 100'),

    body("country")
        .notEmpty().withMessage("Country is required")
        .isIn(countryCodes).withMessage("Invalid country code"),
];

export const validateLogin = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters'),
];
