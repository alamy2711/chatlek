import React, { useState } from "react";
import { X, AlertTriangle, Ban } from "lucide-react";

const ReportModal = ({ type, userName, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");
    const [selectedReason, setSelectedReason] = useState("");

    const reportReasons = [
        "Spam or unwanted messages",
        "Harassment or bullying",
        "Inappropriate content",
        "Fake profile",
        "Threatening behavior",
        "Other",
    ];

    const blockReasons = [
        "No longer want to receive messages",
        "Inappropriate behavior",
        "Spam messages",
        "Personal reasons",
        "Other",
    ];

    const reasons = type === "report" ? reportReasons : blockReasons;

    const handleSubmit = () => {
        if (selectedReason || reason) {
            onConfirm();
        }
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div
                    className={`border-b border-gray-200 p-6 ${
                        type === "report" ? "bg-red-50" : "bg-orange-50"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className={`rounded-full p-2 ${
                                    type === "report"
                                        ? "bg-red-100"
                                        : "bg-orange-100"
                                }`}
                            >
                                {type === "report" ? (
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                ) : (
                                    <Ban className="h-5 w-5 text-orange-600" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {type === "report"
                                    ? "Report User"
                                    : "Block User"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6">
                    <p className="mb-6 text-gray-600">
                        {type === "report"
                            ? `You are about to report ${userName}. This will help us improve the platform safety.`
                            : `You are about to block ${userName}. They won't be able to message you anymore.`}
                    </p>

                    <div className="mb-6 space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            {type === "report"
                                ? "Reason for reporting:"
                                : "Reason for blocking:"}
                        </label>
                        {reasons.map((reasonOption) => (
                            <label
                                key={reasonOption}
                                className="flex cursor-pointer items-center space-x-3"
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reasonOption}
                                    checked={selectedReason === reasonOption}
                                    onChange={(e) =>
                                        setSelectedReason(e.target.value)
                                    }
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">
                                    {reasonOption}
                                </span>
                            </label>
                        ))}
                    </div>

                    {(selectedReason === "Other" || selectedReason === "") && (
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Additional details (optional):
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide more details..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex space-x-3 bg-gray-50 p-6">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedReason && !reason}
                        className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                            selectedReason || reason
                                ? type === "report"
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-orange-600 text-white hover:bg-orange-700"
                                : "cursor-not-allowed bg-gray-300 text-gray-500"
                        }`}
                    >
                        {type === "report" ? "Submit Report" : "Block User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
