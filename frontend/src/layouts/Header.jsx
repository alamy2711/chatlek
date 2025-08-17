import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Header = () => {
    const authUser = useAuthStore((state) => state.authUser);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 "> */}
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex flex-shrink-0 items-center">
                            <svg
                                className="h-8 w-8 text-indigo-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                    fill="white"
                                />
                                <path
                                    d="M18 15C19.6569 15 21 13.6569 21 12C21 10.3431 19.6569 9 18 9C16.3431 9 15 10.3431 15 12C15 13.6569 16.3431 15 18 15Z"
                                    fill="white"
                                />
                                <path
                                    d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                                    fill="white"
                                />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Chatlek
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links - Center */}
                    {!token && !authUser && (
                        <nav className="hidden space-x-8 md:flex">
                            <a
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-indigo-600"
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-indigo-600"
                            >
                                About
                            </a>
                            <a
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-indigo-600"
                            >
                                Features
                            </a>
                            <a
                                href="#"
                                className="px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-indigo-600"
                            >
                                Contact
                            </a>
                        </nav>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center">
                        {token && authUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex cursor-pointer items-center focus:outline-none"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-white bg-indigo-100 font-medium text-indigo-600 duration-100 hover:border-2 hover:ring-2">
                                        {authUser.avatar ? (
                                            <img
                                                src={authUser.avatar}
                                                alt="Avatar"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {authUser.fullName.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <svg
                                        className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 transform" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-200 focus:outline-none"
                                        >
                                            <div className="py-1">
                                                {/* Profile, Settings, Logout links with lucide icons */}
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {/* Profile icon with lucide icon */}
                                                    <UserRound
                                                        icon="user"
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {/* Profile icon with lucide icon */}
                                                    <Settings
                                                        icon="user"
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Settings
                                                </Link>
                                                <Link
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={logout}
                                                >
                                                    {/* Profile icon with lucide icon */}
                                                    <LogOut
                                                        icon="user"
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    Logout
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-indigo-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
