"use client";

import { useEffect, useState } from "react";
import { Bell, BellDot, X } from "lucide-react";
import api from "@/lib/axios";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data);
            const unread = await api.get("/notifications/unread-count");
            setUnreadCount(unread.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: number) => {
        await api.post(`/notifications/${id}/read`);
        fetchNotifications();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-full"
            >
                {unreadCount > 0 ? (
                    <>
                        <BellDot className="w-6 h-6 text-blue-600" />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {unreadCount}
                        </span>
                    </>
                ) : (
                    <Bell className="w-6 h-6" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Notifications</h3>
                        <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">Aucune notification</div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <h4 className="font-semibold text-sm text-gray-900">{n.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block italic">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
