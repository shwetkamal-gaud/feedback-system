import { FeedbackType, User } from '@/types/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Modal = ({
    isOpen,
    onClose,
    role,
    feedback
}: {
    isOpen: boolean;
    onClose: () => void;
    role: "manager" | "employee";
    feedback: FeedbackType
}) => {
    const [strengths, setStrengths] = useState(feedback.strengths ?? '')
    const [improve, setImprove] = useState(feedback.areas_to_improve ?? '')
    const [sentiment, setSentiment] = useState(feedback.sentiment ?? '')
    const [employee, setEmployee] = useState(feedback.employee_id)
    const [team, setTeam] = useState<User[]>()
    const [tags, setTags] = useState(feedback.tags?.join(", ") ?? '');
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/feedback//team/members')
            const data = await res.json()
            setTeam(data)
        }
        fetchData()
    }, [])
    const handleSubmit = async () => {
        const body = {
            strengths,
            areas_to_improve: improve,
            sentiment,
            tags: tags.split(",").map(tag => tag.trim()),
            employee_id: employee
        };

        const endpoint = feedback?.id
            ? `/api/feedback/${feedback.id}`
            : `/api/feedback`;

        const method = feedback?.id ? "PATCH" : "POST";

        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (res.ok) onClose();
        else alert("Something went wrong.");
    };
    const handleAcknowledge = async () => {
        const res = await fetch(`/feedback/acknowledge${feedback.id}/ack`, { method: "PATCH" });
        if (res.ok) onClose();
    };


    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                {role === 'employee' ? <><input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                    value={strengths}
                    onChange={e => setStrengths(e.target.value)}
                />
                    <button
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleAcknowledge}
                    >
                        Acknowledge
                    </button>
                </> : <>

                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl'>{feedback.id ? 'Edit' : 'Submit'}</h2>
                        <button onClick={onClose} className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-800">
                            <X />
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={strengths}
                        onChange={e => setStrengths(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={improve}
                        onChange={e => setImprove(e.target.value)}
                    />
                    <select
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={sentiment}
                        onChange={e => setSentiment(e.target.value)}
                    >
                        <option value="">Select Sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                    />
                    <select
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={employee}
                        onChange={e => setEmployee(parseInt(e.target.value))}
                    >{team?.map((items) => (
                        <option value={items.id} >{items.name}</option>
                    ))}

                    </select>
                    <button
                        className="mt-4 bg-[#4e3d9b] text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        {feedback?.id ? "Update Feedback" : "Submit Feedback"}
                    </button>
                </>}
            </div>
        </div>
    )
}

export default Modal