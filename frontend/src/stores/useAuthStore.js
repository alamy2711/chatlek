import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import axiosClient from "../lib/axiosClient";
import { useChatStore } from "./useChatStore";
import { use } from "react";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    token: localStorage.getItem("token") || null,
    authSocket: null,

    // Loading states
    authUserLoading: true,

    // Setters
    setAuthUser: (user) => set({ authUser: user }),
    setToken: (newToken) => {
        set({ token: newToken });
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    },

    // Actions
    fetchAuthUser: async () => {
        const { token, setToken } = get();
        if (!token) {
            set({ authUser: null, authUserLoading: false });
            return;
        }

        // If token exists, fetch the authenticated user
        set({ authUserLoading: true });
        try {
            const response = await axiosClient.get("/users/me");
            set({ authUser: response.data.user, authUserLoading: false });
            get().connectSocket(); // Connect socket
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("object");
                // Not logged in — expected
                setToken(null);
                set({ authUser: null, authUserLoading: false });
                toast.error("Session expired, please log in again");
            } else {
                console.error("Failed to fetch auth user:", error);
                set({ authUser: null, authUserLoading: false });
            }
        }
    },
    logout: async () => {
        set({ authUserLoading: true });
        try {
            await axiosClient.post("/auth/logout");
            get().setToken(null); // Clear token from state and localStorage
            set({ authUser: null, token: null });
            toast("Logged out successfully");
            get().disconnectSocket(); // Disconnect socket
        } catch (error) {
            console.error("Failed to logout:", error);
            toast.error("Failed to logout, please try again");
        } finally {
            set({ authUserLoading: false });
        }
    },


    // Socket actions
    connectSocket: () => {
        const token = get().token;
        const authUser = get().authUser;
        const authSocket = get().authSocket;
        const setOnlineUsers = useChatStore.getState().setOnlineUsers;

        if (!token || !authUser || authSocket?.connected) return;

        const socket = io(
            import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:5001",
            {
                query: { userId: authUser.id },
            },
        );
        set({ authSocket: socket });

        socket.on("online-users", (onlineUsersIds) => {
            setOnlineUsers(onlineUsersIds);

        });
    },
    disconnectSocket: () => {
        const authSocket = get().authSocket;
        if (authSocket?.connected) authSocket.disconnect();
    },
}));

export const useAuthUser = () => useAuthStore((state) => state.authUser);
