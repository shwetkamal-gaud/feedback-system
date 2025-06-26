'use client'

import { useAuthContext } from '@/context/AuthContext';
import getBaseUrl from '@/lib/getBaseUrl';
import React, { useEffect, useState } from 'react'

type NotificationProp = {
    id: number;
    message: string;
    is_read: boolean;
};
const baseUrl = getBaseUrl();
const Notification = () => {
    const [notifications, setNotifications] = useState<NotificationProp[]>([]);
    const { authUser } = useAuthContext()
    useEffect(() => {
        console.log(authUser,"auth")
        if (authUser?.email) {
            fetch(`${baseUrl}/notifications`, { credentials: "include" })
                .then(res => res.json())
                .then((data: NotificationProp[]) =>
                    setNotifications(data?.filter(n => !n.is_read))
                );
        }
    }, [authUser]);
    const markAsRead = async (id: number) => {
        await fetch(`${baseUrl}/notifications/${id}`, { method: "PATCH", credentials: "include" });
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;
    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {notifications.map((notif) => (
                <ToastCard
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    onDismiss={() => markAsRead(notif.id)}
                />
            ))}
        </div>
    )
}

const ToastCard = ({
    id,
    message,
    onDismiss,
}: {
    id: number;
    message: string;
    onDismiss: () => void;
}) => {
    const [progress, setProgress] = useState(100);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (hover) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [hover]);
    return (
        <>
        {progress >0 &&<div
            className=" border border-[#4e3d9b] shadow-md rounded-lg p-4 w-80 animate-slide-in-up"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <p className="text-sm text-gray-800">{message}</p>
            <div className="flex flex-col  gap-2 justify-between items-start mt-2">
                <button onClick={onDismiss} className="text-[#4e3d9b] text-sm hover:underline">
                    Mark as Read
                </button>
                <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                    <div
                        className="bg-[#4e3d9b] h-full transition-all"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>}
        </>
    )

}

export default Notification