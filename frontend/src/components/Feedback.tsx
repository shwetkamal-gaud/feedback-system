'use client'
import { useAuthContext } from '@/context/AuthContext';
import { FeedbackType, Request } from '@/types/types';
import React, { useEffect, useState } from 'react'
import Modal from './Modal';
import getBaseUrl from '@/lib/getBaseUrl';

const baseUrl = getBaseUrl();

const Feedback = () => {
    const { authUser } = useAuthContext();
    const [modalOpen, setModalOpen] = useState(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [request, setRequest] = useState<Request[]>([])
    const [single, setSingle] = useState<FeedbackType| null>(null);
    const [requestId, setRequestId] = useState(0)
    const getFeedback = async () => {
        const endpoint = "/feedback";
        await fetch(baseUrl + endpoint, { credentials: 'include' })
            .then((res) => res.json())
            .then(setFeedbacks);
    }
    const getFeedbackReq = async () => {
        await fetch(baseUrl + '/feedback/request', { credentials: 'include' }).then((res) => res.json()).then(setRequest)
    }
    useEffect(() => {
        getFeedback()
        if (authUser?.role === 'manager') {
            getFeedbackReq()
        }
    }, [authUser?.role, modalOpen]);

    const handleAcknowledge = async (id: number) => {
        await fetch(`${baseUrl}/feedback/acknowledge/${id}`, { method: "PATCH", credentials: 'include' });
        setFeedbacks((prev) =>
            prev.map((fb) =>
                fb.id === id ? { ...fb, is_acknowledged: true } : fb
            )
        );
        getFeedback()
    }

    const handleEdit = async (id: number) => {
        await fetch(`${baseUrl}/feedback/single/${id}`, { credentials: 'include' }).then((res) => res.json()).then((data) => setSingle(data))
        setModalOpen(true)
    }

    console.log(single, "si")
    if (!authUser) return <p className="p-4 text-gray-600">Loading...</p>;
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Feedback</h1>

            <button
                onClick={() => {setModalOpen(true); setSingle(null)}}
                className="bg-[#4e3d9b] text-white px-4 py-2 rounded shadow"
            >
                {authUser.role === "manager" ? "Submit Feedback" : "Request Feedback"}
            </button>
            {feedbacks.length > 0 ?

                <div className="mt-6 space-y-4">
                    {feedbacks?.map((fb) => (
                        <div key={fb.id} className="border border-[#4e3d9b] p-4 rounded shadow">
                            <p className="text-sm text-gray-500">{new Date(fb.timestamp).toLocaleString()}</p>
                            <p><strong>Sentiment:</strong> {fb.sentiment}</p>
                            <p><strong>Strengths:</strong> {fb.strengths}</p>
                            <p><strong>Areas to Improve:</strong> {fb.areas_to_improve}</p>

                            {authUser.role === "employee" && fb.acknowledged === false && (
                                <button
                                    className="mt-2 text-sm text-[#4e3d9b] hover:underline"
                                    onClick={() => handleAcknowledge(fb.id)}
                                >
                                    Mark as Acknowledged
                                </button>
                            )}

                            {authUser.role === "manager" && (
                                <button onClick={() => handleEdit(fb.id)} className="mt-2 text-sm text-gray-700 underline">
                                    Edit Feedback
                                </button>
                            )}
                        </div>
                    ))}

                </div>
                : <p>No feedback data</p>}
            {authUser.role === "manager" && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Requested Feedback</h2>
                    {request.length > 0 ?
                        <div className="space-y-4">
                            {request.map((req) => (
                                <div key={req.id} className=" border-[#4e3d9b] border p-4 rounded  shadow">
                                    <p className="text-sm text-gray-500">
                                        Requested on: {new Date(req.timestamp).toLocaleString()}
                                    </p>
                                    <p><strong>Message:</strong> {req.message}</p>
                                    <div className='flex gap-2 items-center'>
                                        <button
                                            onClick={() => {
                                                setSingle({ employee_id: req.employee_id } as FeedbackType);
                                                setRequestId(req.id)
                                                setModalOpen(true);
                                            }}
                                            className="bg-[#4e3d9b] text-white px-3 py-1 rounded text-sm"
                                        >
                                            Submit Feedback
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await fetch(`${baseUrl}/feedback/requests/${req.id}`, {
                                                    method: 'DELETE',
                                                    credentials: 'include',
                                                });
                                                setRequest(prev => prev.filter(r => r.id !== req.id));
                                            }}
                                            className="ml-3 bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                        : <p>No Request data</p>}
                </div>
            )}
            {modalOpen &&
                <Modal id={requestId} feedback={single} isOpen={modalOpen} onClose={() => setModalOpen(false)} role={authUser.role} />
            }
        </div>
    )
}

export default Feedback