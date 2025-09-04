import { AlertTriangle, Ban, Menu, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../stores/useChatStore";

// Components
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import ReportModal from "./ReportModal";

const ConversationView = ({ onOpenSidebar }) => {
    const selectedUser = useChatStore((state) => state.selectedUser);
    const conversation = useChatStore((state) => state.conversation);
    const messages = useChatStore((state) => state.messages);
    const fetchMessages = useChatStore((state) => state.fetchMessages);
    const messagesLoading = useChatStore((state) => state.messagesLoading);
    const conversationLoading = useChatStore(
        (state) => state.conversationLoading,
    );
    const onlineUsers = useChatStore((state) => state.onlineUsers);
    const subscribeToMessages = useChatStore(
        (state) => state.subscribeToMessages,
    );
    const unsubscribeFromMessages = useChatStore(
        (state) => state.unsubscribeFromMessages,
    );
    const unreadMessages = useChatStore((state) => state.unreadMessages);
    const setUnreadMessages = useChatStore((state) => state.setUnreadMessages);

    useEffect(() => {
        if (!conversation) return;

        fetchMessages(conversation?._id);

        // clear unread messages
        setUnreadMessages({
            ...unreadMessages,
            [selectedUser.id]: 0,
        });
    }, [
        selectedUser?.id,
        conversation,
        fetchMessages,
        subscribeToMessages,
        unsubscribeFromMessages,
    ]);

    //
    const [showActions, setShowActions] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState("report");
    const messagesEndRef = useRef(null);
    const actionsRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                actionsRef.current &&
                !actionsRef.current.contains(event.target)
            ) {
                setShowActions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReport = () => {
        setReportType("report");
        setShowReportModal(true);
        setShowActions(false);
    };

    const handleBlock = () => {
        setReportType("block");
        setShowReportModal(true);
        setShowActions(false);
    };

    if (conversationLoading || messagesLoading)
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="size-10 animate-spin" />
            </div>
        );

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onOpenSidebar}
                            className="text-gray-500 transition-colors duration-200 hover:text-gray-700 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="relative">
                            <div
                                className={`overflow-hidden rounded-full ring-3 ${selectedUser.gender === "male" ? "ring-blue-500" : selectedUser.gender === "female" ? "ring-pink-500" : "ring-gray-500"}`}
                            >
                                {selectedUser.avatar ? (
                                    <img
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                                        {selectedUser.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div
                                className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${
                                    onlineUsers.includes(selectedUser.id)
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                }`}
                            />
                        </div>
                        <div>
                            <div className="flex items-center space-x-3">
                                <h2 className="font-semibold text-gray-900">
                                    {selectedUser.fullName}{" "}
                                </h2>
                                {selectedUser.age && (
                                    <span
                                        className={`flex w-8 items-center justify-center rounded-full p-1 text-sm font-semibold text-white ${selectedUser.gender === "male" ? "bg-blue-400" : "bg-pink-400"}`}
                                    >
                                        {selectedUser.age}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">
                                {onlineUsers.includes(selectedUser.id)
                                    ? "Online"
                                    : "Offline"}
                            </p>
                        </div>
                    </div>

                    <div className="relative" ref={actionsRef}>
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showActions && (
                            <div className="absolute top-12 right-0 z-10 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                <button
                                    onClick={handleReport}
                                    className="flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    <AlertTriangle size={16} />
                                    <span>Report User</span>
                                </button>
                                <button
                                    onClick={handleBlock}
                                    className="flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Ban size={16} />
                                    <span>Block User</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
                <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4">
                    {/* {messages.map((message) => ( */}
                    {[...messages].reverse().map((message) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{type: "spring", stiffness: 300, damping: 15}}
                            key={message._id}
                        >
                            <Message
                                message={message}
                                isOwn={message.sender !== selectedUser.id}
                            />
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </AnimatePresence>

            {/* Message Input */}
            <MessageInput />

            {/* Report Modal */}
            {showReportModal && (
                <ReportModal
                    type={reportType}
                    userName={selectedUser.fullName}
                    onClose={() => setShowReportModal(false)}
                    onConfirm={() => {
                        // Handle report/block logic here
                        console.log(
                            `${reportType} user:`,
                            selectedUser.fullName,
                        );
                        setShowReportModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default ConversationView;
