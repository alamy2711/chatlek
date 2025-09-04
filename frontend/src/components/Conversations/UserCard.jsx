import { useChatStore } from "../../stores/useChatStore";

const UserCard = ({ user, isSelected, onClick }) => {
    const onlineUsers = useChatStore((state) => state.onlineUsers);
    const unreadMessages = useChatStore((state) => state.unreadMessages);

    const formatLastSeen = (date) => {
        if (!date) return "Unknown";

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer border-b border-gray-100 p-4 transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? "border-r-4  border-r-blue-600 bg-blue-50" : ""
            }`}
        >
            <div className="flex items-center space-x-3">
                <div className={`relative`}>
                    <div
                        className={`overflow-hidden rounded-full ring-3 ${user.gender === "male" ? "ring-blue-500" : "ring-pink-500"}`}
                    >
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                                {user.fullName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div
                        className={`absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            onlineUsers.includes(user.id)
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex min-w-0 flex-1 items-center space-x-2">
                            <h3 className="truncate text-sm font-semibold text-gray-900">
                                {user.fullName}
                            </h3>
                        </div>
                        <span className="h-5 w-8 overflow-hidden rounded-md">
                            <img
                                src={`https://flagcdn.com/h20/${user.country.code}.png`}
                                alt={user.country.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            {onlineUsers.includes(user.id) ? (
                                <span className="font-medium text-green-600">
                                    Online
                                </span>
                            ) : (
                                `Last seen ${formatLastSeen(user.lastSeen)}`
                            )}
                        </p>
                        <span>
                            {unreadMessages[user.id] > 0 && (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                    {unreadMessages[user.id]}
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
