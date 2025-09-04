import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import axiosClient from "../lib/axiosClient";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    token: localStorage.getItem("token") || null,
    authSocket: null,

    // Loading states
    authUserLoading: true,
    logoutLoading: false,

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
        const { token, setToken, logoutLoading } = get();
        if (!token) {
            set({ authUser: null, authUserLoading: false });
            return;
        }

        if (logoutLoading) return;

        // If token exists, fetch the authenticated user
        set({ authUserLoading: true });
        try {
            const response = await axiosClient.get("/users/me");
            set({ authUser: response.data.user, authUserLoading: false });
            get().connectSocket(); // Connect socket
        } catch (error) {
            if (error.response?.status === 401) {
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
        const { disconnectSocket } = get();

        set({ authUserLoading: true, logoutLoading: true });
        try {
            await axiosClient.post("/auth/logout");
            set({ token: null, authUser: null });
            toast("Logged out successfully");
            disconnectSocket();
        } catch (error) {
            console.error("Failed to logout:", error);
            toast.error("Failed to logout, please try again");
        } finally {
            set({ authUserLoading: false, logoutLoading: false });
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
            import.meta.env.MODE === "development"
                ? import.meta.env.VITE_API_BASE_URL
                : `/`,
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
        const {
            setConversation,
            setMessages,
            setSelectedUser,
            unsubscribeFromMessages,
        } = useChatStore.getState();

        if (authSocket?.connected) authSocket.disconnect();

        setConversation(null);
        setMessages([]);
        setSelectedUser(null);
        unsubscribeFromMessages();
    },

    subscribeToUsers: () => {
        const authSocket = get().authSocket;
        const { setUsers, users } = useChatStore.getState();

        if (!authSocket) return;

        authSocket.on("new-user", (newUser) => {
            if (users.some((user) => user.id === newUser.id)) return;

            setUsers((prevUsers) => [...prevUsers, newUser]);
        });

        authSocket.on("user-deleted", (userId) => {
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userId),
            );
        });
    },
}));

export const useAuthUser = () => useAuthStore((state) => state.authUser);
