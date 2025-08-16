import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../../stores/useChatStore";

// Components
import { Loader } from "lucide-react";
import UserCard from "./UserCard";

const UsersList = ({ onCloseSidebar }) => {
    const users = useChatStore((state) => state.users);
    const fetchUsers = useChatStore((state) => state.fetchUsers);
    const selectedUser = useChatStore((state) => state.selectedUser);
    const selectUser = useChatStore((state) => state.selectUser);
    const usersLoading = useChatStore((state) => state.usersLoading);
    const startConversation = useChatStore((state) => state.startConversation);
    const onlineUsersIds = useChatStore((state) => state.onlineUsers);

    useEffect(() => {
        fetchUsers();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [genderFilter, setGenderFilter] = useState("all");

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesGender =
            genderFilter === "all" || user.gender === genderFilter;
        return matchesSearch && matchesGender;
    });

    const onlineUsers = filteredUsers.filter((user) => onlineUsersIds.includes(user.id));
    const offlineUsers = filteredUsers.filter((user) => !onlineUsersIds.includes(user.id));

    if (usersLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col border-r border-gray-200 bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">Messages</h1>
                    <button
                        onClick={onCloseSidebar}
                        className="hover:bg-opacity-20 rounded-full p-1 text-white transition-colors duration-200 hover:bg-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search
                        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-opacity-20 border-opacity-30 focus:ring-opacity-50 focus:bg-opacity-30 w-full rounded-full border border-white bg-white py-2 pr-4 pl-10 text-gray-400 placeholder-gray-200 transition-all duration-200 focus:ring-2 focus:ring-white focus:outline-none"
                    />
                </div>
            </div>

            {/* Gender Filter */}
            <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center space-x-1">
                    <Filter size={16} className="text-gray-500" />
                    <span className="mr-3 text-sm font-medium text-gray-700">
                        Filter:
                    </span>
                    <div className="flex space-x-1">
                        {["all", "male", "female"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setGenderFilter(filter)}
                                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                                    genderFilter === filter
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                {filter.charAt(0).toUpperCase() +
                                    filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto">
                {onlineUsers.length > 0 && (
                    <div>
                        <div className="border-b border-green-100 bg-green-50 px-4 py-2">
                            <h3 className="text-sm font-semibold text-green-800">
                                Online ({onlineUsers.length})
                            </h3>
                        </div>
                        {onlineUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={selectedUser?.id === user.id}
                                onClick={() => {
                                    selectUser(user);
                                    if (selectedUser?.id !== user.id)
                                        startConversation(user.id);
                                    onCloseSidebar();
                                }}
                            />
                        ))}
                    </div>
                )}

                {offlineUsers.length > 0 && (
                    <div>
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                            <h3 className="text-sm font-semibold text-gray-600">
                                Offline ({offlineUsers.length})
                            </h3>
                        </div>
                        {offlineUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={selectedUser?.id === user.id}
                                onClick={() => {
                                    selectUser(user);
                                    if (selectedUser?.id !== user.id)
                                        startConversation(user.id);
                                    onCloseSidebar();
                                }}
                            />
                        ))}
                    </div>
                )}

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="mb-2 text-gray-400">
                            <Search size={32} className="mx-auto" />
                        </div>
                        <p className="text-gray-500">No users found</p>
                        <p className="mt-1 text-sm text-gray-400">
                            Try adjusting your search or filter
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;
