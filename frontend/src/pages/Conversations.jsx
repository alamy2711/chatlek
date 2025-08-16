import { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore";

// Components
import ConversationView from "../components/Conversations/ConversationView";
import UsersList from "../components/Conversations/UserList";

const ChatPage = () => {
    const conversation = useChatStore((state) => state.conversation);
    const conversationLoading = useChatStore(
        (state) => state.conversationLoading,
    );

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Listen to messages from socket io
    const selectedUser = useChatStore((state) => state.selectedUser);
    const subscribeToMessages = useChatStore(
        (state) => state.subscribeToMessages,
    );
    const unsubscribeFromMessages = useChatStore(
        (state) => state.unsubscribeFromMessages,
    );
    useEffect(() => {
        subscribeToMessages();

        return () => {
            unsubscribeFromMessages();
        };
    }, [
        selectedUser?.id,
        conversation,
        subscribeToMessages,
        unsubscribeFromMessages,
    ]);

    return (
        // <div className="flex h-screen  overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto flex h-[92vh] overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 shadow-md lg:my-5 lg:h-[88vh]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="zbg-opacity-50 fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Left Sidebar */}
            <div
                className={`fixed z-30 h-full w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:w-80 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
            >
                <UsersList onCloseSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {/* Right Content Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {conversation || conversationLoading ? (
                    <ConversationView
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                    />
                ) : (
                    <div className="flex flex-1 items-center justify-center p-8">
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                                <svg
                                    className="h-12 w-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h2 className="mb-2 text-2xl font-bold text-gray-800">
                                Welcome to Chat
                            </h2>
                            <p className="mx-auto max-w-md text-gray-600">
                                Select a conversation from the sidebar to start
                                chatting with your friends and connections.
                            </p>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 lg:hidden"
                            >
                                View Conversations
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
