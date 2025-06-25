import { useAuthContext } from '@/context/AuthContext';
import { FeedbackType } from '@/types/types';
import React, { useEffect, useState } from 'react'


const Feedback = () => {
    const { authUser } = useAuthContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [single, setSingle] = useState<FeedbackType>();
    useEffect(() => {
        const endpoint = "/api/dashboard/my";

        fetch(endpoint)
            .then((res) => res.json())
            .then(setFeedbacks);
    }, [authUser?.role]);

    const handleAcknowledge = async (id: number) => {
        await fetch(`/api/feedback/${id}/ack`, { method: "PATCH" });
        setFeedbacks((prev) =>
            prev.map((fb) =>
                fb.id === id ? { ...fb, is_acknowledged: true } : fb
            )
        );
    }

    const handleEdit = async (id: number) => {
        await fetch(`/feedback/single/${id}`).then((res) => res.json()).then(setSingle)
        setModalOpen(true)
    }
    if (!authUser) return <p className="p-4 text-gray-600">Loading...</p>;
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Feedback</h1>

            <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
                {authUser.role === "manager" ? "Submit Feedback" : "Request Feedback"}
            </button>

            <div className="mt-6 space-y-4">
                {feedbacks.map((fb) => (
                    <div key={fb.id} className="border p-4 rounded shadow bg-white">
                        <p className="text-sm text-gray-500">{new Date(fb.timestamp).toLocaleString()}</p>
                        <p><strong>Sentiment:</strong> {fb.sentiment}</p>
                        <p><strong>Strengths:</strong> {fb.strengths}</p>
                        <p><strong>Areas to Improve:</strong> {fb.areas_to_improve}</p>

                        {authUser.role === "employee" && fb.is_acknowledged === false && (
                            <button
                                className="mt-2 text-sm text-blue-600 hover:underline"
                                onClick={() => handleAcknowledge(fb.id)}
                            >
                                Mark as Acknowledged
                            </button>
                        )}

                        {authUser.role === "manager" && (
                            <button className="mt-2 text-sm text-gray-700 underline">
                                Edit Feedback
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Feedback