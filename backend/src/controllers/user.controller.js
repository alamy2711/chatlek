import cloudinary from '../lib/cloudinary.js';
import User from '../models/user.model.js';
import { userResource } from '../resources/user.resource.js';
import { userListResource } from '../resources/userList.resource.js';

export const getAuthUser = (req, res) => {
    try {
        const authUser = req.user;
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: userResource(authUser),
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
        const users = await User.find({ _id: { $ne: authUser._id } }).select('fullName avatar age gender country');

        const formattedUsers = users.map(userListResource);

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: formattedUsers,
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
        // Validate that at least one field is provided
        if (!req.body && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update',
            });
        }

        const userToUpdate = await User.findById(req.user._id);

        const newData = { ...req.body };

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
                        if (error) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error uploading image',
                                error: error.message,
                            });
                        }
                        resolve(result);
                    });
                    stream.end(req.file.buffer);
                });
            };

            const uploadResult = await uploadToCloudinary();
            newData.avatar = uploadResult.secure_url;
        }

        // Update all other fields if provided
        await userToUpdate.updateOne(newData);
        console.log('User updated successfully:', userToUpdate);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: userResource(await User.findById(req.user._id)),
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
