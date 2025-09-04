import { motion } from "framer-motion";
import { Image, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useChatStore } from "../../stores/useChatStore";

const MessageInput = () => {
    const sendMessage = useChatStore((state) => state.sendMessage);
    const authSocket = useAuthStore((state) => state.authSocket);

    //
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!authSocket) return;

        authSocket.on("typing", (senderId) => {
            if (senderId === useChatStore.getState().selectedUser.id)
                setIsTyping(true);
        });

        authSocket.on("stop-typing", (senderId) => {
            if (senderId === useChatStore.getState().selectedUser.id)
                setIsTyping(false);
        });

        return () => {
            authSocket.off("typing");
            authSocket.off("stop-typing");
        };
    }, [authSocket]);

    const handleTyping = () => {
        authSocket.emit("typing", {
            senderId: useAuthStore.getState().authUser.id,
            receiverId: useChatStore.getState().selectedUser.id,
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            authSocket.emit("stop-typing", {
                senderId: useAuthStore.getState().authUser.id,
                receiverId: useChatStore.getState().selectedUser.id,
            });
        }, 1500);
    };

    const handleSend = async () => {
        if (message.trim() || selectedImage) {
            setIsSending(true);
            await sendMessage({ content: message, media: selectedImage });
            setMessage("");
            setSelectedImage(null);
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            {selectedImage && (
                <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                <Image size={20} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {selectedImage.name}
                            </span>
                        </div>
                        <button
                            onClick={removeImage}
                            className="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-red-500"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {isTyping && <TypingIndicator />}

            <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Attach image"
                    >
                        <Image size={20} />
                    </button>
                </div>

                <textarea
                    value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    onChange={(e) => {
                        handleTyping();
                        setMessage(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="max-h-32 min-h-[44px] w-full resize-none overflow-y-auto rounded-2xl border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={1}
                />

                <motion.button
                    whileTap={{ scale: 0.1}}
                    onClick={handleSend}
                    disabled={(!message.trim() && !selectedImage) || isSending}
                    className={`rounded-full p-2 transition-all duration-200 ${
                        message.trim() || selectedImage
                            ? "transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                            : "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                >
                    <Send size={20} />
                </motion.button>
            </div>
        </div>
    );
};

function TypingIndicator() {
    return (
        <div className="mb-2 ml-2 flex items-center space-x-1">
            <motion.span
                className="size-1.5 rounded-full bg-blue-500"
                animate={{ y: [0, -4, 0], scale: [1, 1.2, 1] }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            />
            <motion.span
                className="size-1.5 rounded-full bg-blue-500"
                animate={{ y: [0, -4, 0], scale: [1, 1.2, 1] }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.2,
                }}
            />
            <motion.span
                className="size-1.5 rounded-full bg-blue-500"
                animate={{ y: [0, -4, 0], scale: [1, 1.2, 1] }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.4,
                }}
            />
            <span className="ml-2 text-sm text-gray-600">Typing...</span>
        </div>
    );
}

export default MessageInput;
