import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import axiosClient from "../lib/axiosClient";
import { useAuthStore } from "../stores/useAuthStore";
import { sortedCountries } from "../utils/countriesUtils";

const Profile = () => {
    const authUser = useAuthStore((state) => state.authUser);
    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const setToken = useAuthStore((state) => state.setToken);
    const disconnectSocket = useAuthStore((state) => state.disconnectSocket);

    // Form data
    const [formData, setFormData] = useState({
        fullName: authUser.fullName || "",
        age: authUser.age || "",
        gender: authUser.gender || "",
        country: authUser.country.code || "",
        avatar: authUser.avatar || "",
    });

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [tempPicture, setTempPicture] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState({
        save: false,
        password: false,
        delete: false,
    });

    const fileInputRef = useRef(null);

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempPicture(URL.createObjectURL(file));
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save changes
    const handleSave = async () => {
        const dataToSend = new FormData();
        dataToSend.append("fullName", formData.fullName);
        dataToSend.append("age", formData.age);
        dataToSend.append("gender", formData.gender);
        dataToSend.append("country", formData.country);

        if (fileInputRef.current?.files[0]) {
            dataToSend.append("avatar", fileInputRef.current.files[0]);
        }

        setIsSubmitting((prev) => ({ ...prev, save: true }));

        try {
            const response = await axiosClient.put("/users/me", dataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setAuthUser(response.data.user);
            setTempPicture(null);
            toast.success("Profile updated successfully");
            setIsEditing(false);
            setErrors({});
        } catch (err) {
            console.error("Error during update profile:", err);
            if (err.response?.data?.errors) {
                const formattedErrors = {};
                err.response.data.errors.forEach((e) => {
                    formattedErrors[e.field] = e.message;
                });
                setErrors(formattedErrors);
            } else {
                setErrors({});
                toast.error(err.response?.data?.message || "An error occurred");
            }
        } finally {
            setIsSubmitting((prev) => ({ ...prev, save: false }));
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        setIsSubmitting((prev) => ({ ...prev, delete: true }));
        try {
            await axiosClient.delete("/users/me");
            setToken(null);
            setAuthUser(null);
            disconnectSocket();
            toast("Goodbye!", {
                icon: "👋",
            });
        } catch (error) {
            console.error("Failed to delete account:", error);
            toast.error("Failed to delete account, please try again");
        } finally {
            setIsSubmitting((prev) => ({ ...prev, delete: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        duration: 0.3,
                    }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-3xl font-bold text-gray-900">
                        Profile Settings
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your personal information and account settings
                    </p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        duration: 0.3,
                        delay: 0.2,
                    }}
                    className="overflow-hidden rounded-lg bg-white shadow-xl"
                >
                    {/* Profile Picture Section */}
                    <div className="relative flex h-48 items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
                            <div className="group relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15,
                                        duration: 0.3,
                                        delay: 0.4,
                                    }}
                                    className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg"
                                >
                                    {tempPicture || authUser.avatar ? (
                                        <>
                                            <img
                                                src={
                                                    tempPicture ||
                                                    authUser.avatar
                                                }
                                                alt="Avatar"
                                                className="h-full w-full object-cover"
                                            />
                                            {isEditing && tempPicture && (
                                                <button
                                                    onClick={() =>
                                                        setTempPicture(null)
                                                    }
                                                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-4xl font-bold text-indigo-600">
                                            {authUser.fullName.charAt(0)}
                                        </div>
                                    )}
                                </motion.div>

                                {isEditing && (
                                    <>
                                        <button
                                            onClick={() =>
                                                fileInputRef.current.click()
                                            }
                                            className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-700"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="px-6 pt-20 pb-8 sm:px-10">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {authUser.fullName}
                                </h2>
                                <p className="text-gray-500">
                                    Member since{" "}
                                    {new Date(
                                        authUser.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="space-x-3">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTempPicture(null);
                                        }}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Personal Information */}
                        <div className="mb-10">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.fullName && (
                                                <p className="text-sm text-red-500">
                                                    {errors.fullName}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-600">
                                            {authUser.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={authUser.email}
                                            readOnly
                                            disabled
                                            className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-2"
                                        />
                                    ) : (
                                        <p className="text-gray-600">
                                            {authUser.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-gray-600">
                                            {authUser.age}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Gender
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-600 capitalize">
                                            {authUser.gender}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    {isEditing ? (
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {sortedCountries.map(
                                                ([code, name]) => (
                                                    <option
                                                        key={code}
                                                        value={code}
                                                    >
                                                        {name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    ) : (
                                        <p className="text-gray-600">
                                            {authUser.country.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="mb-10">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Change Password
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                                    Update Password
                                </button>
                            </div>
                        </div>

                        {/* Delete Account Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Delete Account
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Once you delete your account, there is no going
                                back. Please be certain.
                            </p>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                        >
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Are you sure you want to delete your account?
                            </h3>
                            <p className="mb-6 text-gray-600">
                                All of your data will be permanently removed.
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
