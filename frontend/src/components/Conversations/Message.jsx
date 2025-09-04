import { useChatStore } from "../../stores/useChatStore";

const Message = ({ message, isOwn }) => {
    const selectedUser = useChatStore((state) => state.selectedUser);

    //
    const formatTime = (date) => {
        if (!date) return "Unknown";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isImage =
        message.type === "image" ||
        (message.type === "text" &&
            message.content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ||
        (message.type === "text" &&
            message.content.includes("images.pexels.com"));

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`flex max-w-xs items-end space-x-2 sm:max-w-md lg:max-w-lg ${
                    isOwn ? "flex-row-reverse space-x-reverse" : ""
                }`}
            >
                {!isOwn && (
                    <>
                        {/* User avatar */}
                        {selectedUser.avatar ? (
                            <img
                                src={selectedUser.avatar}
                                alt="User"
                                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <div className="text-md flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                                {selectedUser.fullName.charAt(0)}
                            </div>
                        )}
                    </>
                )}

                <div
                    className={`rounded-2xl px-4 py-2 max-w-50 md:max-w-100   ${
                        isOwn
                            ? "rounded-br-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "rounded-bl-sm border border-gray-200 bg-white text-gray-800 shadow-sm"
                    }`}
                >
                    {isImage ? (
                        <div className="space-y-2">
                            <img
                                src={message.content}
                                alt="Shared image"
                                className="h-auto max-w-full cursor-pointer rounded-lg transition-opacity duration-200 hover:opacity-90"
                                onClick={() =>
                                    window.open(message.content, "_blank")
                                }
                            />
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed break-words">
                            {message.content}
                        </p>
                    )}

                    <div
                        className={`mt-1 text-xs ${
                            isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                    >
                        {formatTime(message.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
