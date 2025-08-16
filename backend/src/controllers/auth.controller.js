import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { userResource } from '../resources/user.resource.js';
import { generateToken } from '../utils/generateToken.js';

export const signup = async (req, res) => {
    const { fullName, email, password, gender, age, country } = req.body;
    try {
        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
                errors: [{ field: 'email', message: 'Email is already in use' }],
            });
        }

        // crypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            gender,
            age,
            country,
        });

        // generate token and save user
        generateToken(newUser._id, res);
        await newUser.save();

        // send response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userResource(newUser),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                errors: [
                    { field: 'password', message: 'Invalid credentials' },
                    { field: 'email', message: 'Invalid credentials' },
                ],
            });
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                errors: [
                    { field: 'password', message: 'Invalid credentials' },
                    { field: 'email', message: 'Invalid credentials' },
                ],
            });
        }

        // generate token
        generateToken(user._id, res);

        // send response
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: userResource(user),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const logout = (req, res) => {
    try {
        // clear cookie
        res.cookie('jwt', '', {
            maxAge: 0,
        });

        // send response
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
