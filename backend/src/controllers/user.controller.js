import cloudinary from '../lib/cloudinary.js';
import User from '../models/user.model.js';

export const getAuthUser = (req, res) => {
    try {
        const authUser = req.user;
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: authUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const listUsers = async (req, res) => {
    try {
        const authUser = req.user;
        const users = await User.find({ _id: { $ne: authUser._id } }).select('-password -__v'); // __v is excluded to avoid versioning issues
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getUser = (req, res) => {
    // Logic to get a user by ID
};

export const updateUser = async (req, res) => {
    try {
        const { fullName, avatar } = req.body;

        // Validate that at least one field is provided
        if (!fullName && !avatar) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        const authUser = req.user;
        const userToUpdate = await User.findById(authUser._id);

        if (avatar) {
            const uploadResponse = await cloudinary.uploader.upload(avatar);
            userToUpdate.avatar = uploadResponse.secure_url;
        }

        if (fullName) {
            userToUpdate.fullName = fullName;
        }

        await userToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: userToUpdate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const deleteUser = (req, res) => {
    // Logic to delete a user by ID
};
