import toast from "react-hot-toast";
import { create } from "zustand";
import axiosClient from "../lib/axiosClient";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    users: [],
    conversation: null,
    messages: [],
    selectedUser: null,
    onlineUsers: [],
    unreadMessages: {},

    // Setters
    setUsers: (updater) =>
        set((state) => {
            const newUsers =
                typeof updater === "function" ? updater(state.users) : updater;
            // remove duplicates by id
            const uniqueUsers = newUsers.filter(
                (u, i, self) => i === self.findIndex((x) => x.id === u.id),
            );
            return { users: uniqueUsers };
        }),
    setConversation: (conversation) => set({ conversation }),
    setMessages: (messages) => set({ messages }),
    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },
    setOnlineUsers: (onlineUsersIds) => set({ onlineUsers: onlineUsersIds }),
    setUnreadMessages: (unreadMessages) => set({ unreadMessages }),

    // Loading states
    usersLoading: true,
    conversationLoading: false,
    messagesLoading: true,

    // Actions
    fetchUsers: async () => {
        set({ usersLoading: true });
        try {
            const response = await axiosClient.get("/users");
            set({ users: response.data.users, usersLoading: false });
        } catch (error) {
            console.error("Failed to fetch users:", error);
            set({ users: [], usersLoading: false });
            toast.error("Failed to load users");
        }
    },

    startConversation: async (userId) => {
        set({ conversationLoading: true, messages: [] });
        try {
            const response = await axiosClient.post("/conversations/start", {
                receiverId: userId,
            });
            set({
                conversation: response.data.conversation,
                conversationLoading: false,
            });
        } catch (error) {
            console.error("Failed to start conversation:", error);
            set({ conversation: null, conversationLoading: false });
            toast.error("Failed to start conversation");
        }
    },

    fetchMessages: async (conversationId) => {
        set({ messagesLoading: true });
        try {
            const response = await axiosClient.get(
                `/messages/conversation/${conversationId}`,
            );
            set({ messages: response.data.messages, messagesLoading: false });
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            set({ messages: [], messagesLoading: false });
            toast.error("Failed to load messages");
        }
    },

    sendMessage: async (formData) => {
        const conversation = get().conversation;
        const messages = get().messages;
        try {
            const response = await axiosClient.post(
                `/messages/conversation/${conversation._id}`,
                formData,
            );
            set({
                // messages: [...messages, response.data.message],
                messages: [response.data.message, ...messages],
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const authUser = useAuthStore.getState().authUser;
        const authSocket = useAuthStore.getState().authSocket;

        authSocket.on("new-message", (newMessage) => {
            const selectedUser = get().selectedUser;

            // Append message if it’s from the currently selected conversation
            if (newMessage.sender === selectedUser?.id) {
                set((state) => ({ messages: [newMessage, ...state.messages] }));
            }

            // Play sound + update unread count if it's from another conversation
            if (
                newMessage.sender !== authUser.id &&
                selectedUser?.id !== newMessage.sender
            ) {
                const audio = new Audio("/sounds/new_notification.mp3");
                audio.play();

                set((state) => ({
                    unreadMessages: {
                        ...state.unreadMessages,
                        [newMessage.sender]:
                            (state.unreadMessages[newMessage.sender] || 0) + 1,
                    },
                }));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const authSocket = useAuthStore.getState().authSocket;
        authSocket.off("new-message");
        set((state) => ({ messages: [] }));
    },

    subscribeToTyping: () => {
        const authSocket = useAuthStore.getState().authSocket;
        
        if (!authSocket) return;

        authSocket.on("typing", () => {
            
        });
    }
}));
