import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axiosClient from "../lib/axiosClient";
import { useAuthStore } from "../stores/useAuthStore";
import { Loader } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "123456789",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const setToken = useAuthStore((state) => state.setToken);
    const connectSocket = useAuthStore((state) => state.connectSocket);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axiosClient.post("/auth/login", formData);
            setAuthUser(response.data.user);
            setToken("LOGGED_IN");
            setErrors({});
            connectSocket(); // Connect socket after successful login
        } catch (err) {
            console.error("Error during login:", err);
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
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Decorative Side */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-12 lg:flex"
            >
                <div className="max-w-md text-white">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="mb-6 text-4xl font-bold">
                            Join Our Community
                        </h1>
                        <p className="mb-8 text-xl opacity-90">
                            Start your journey with us today and discover a
                            world of possibilities. Connect with like-minded
                            people and grow together.
                        </p>
                    </motion.div>

                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="mb-6 flex items-center">
                            <div className="mr-4 h-1 w-12 bg-blue-300"></div>
                            <span className="font-medium text-blue-200">
                                Why join us?
                            </span>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-blue-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                                <span>Exclusive content</span>
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-blue-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                                <span>Personalized experience</span>
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-blue-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                                <span>24/7 support</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="mt-16"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-lg bg-blue-400 opacity-20 blur"></div>
                            <div className="bg-opacity-10 border-opacity-30 relative rounded-lg border border-blue-400 bg-blue-500 p-6 backdrop-blur-sm backdrop-filter">
                                <p className="italic">
                                    "The best way to predict the future is to
                                    create it."
                                </p>
                                <p className="mt-2 text-blue-200">
                                    — Abraham Lincoln
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Form Side */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Log In to Your Account
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Enter your email and password to access your
                            account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="Your email address"
                                required
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-medium text-white transition duration-200 hover:shadow-md disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {/* Log In */}
                            {isSubmitting ? (
                                <Loader className="animate-spin h-5 w-5 mx-auto" />
                            ) : (
                                "Log In"
                            )}
                        </motion.button>

                        <div className="text-center text-sm text-gray-500">
                            You don't have an account yet?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
