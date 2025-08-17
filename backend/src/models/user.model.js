import mongoose from 'mongoose';
import { countryCodes } from '../utils/countriesUtils.js';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        avatar: {
            type: String,
            default: '',
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            lowercase: true,
            required: true,
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
            required: true,
        },
        country: {
            type: String,
            required: true,
            lowercase: true,
            enum: countryCodes, // Optional strict check using same source
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
