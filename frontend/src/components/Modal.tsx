import getBaseUrl from '@/lib/getBaseUrl';
import { FeedbackType, Request, User } from '@/types/types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
const baseUrl = getBaseUrl();

const Modal = ({
    isOpen,
    onClose,
    role,
    feedback,
    id
}: {
    isOpen: boolean;
    onClose: () => void;
    role: "manager" | "employee";
    feedback?: FeedbackType | null,
    id: number
}) => {
    const [strengths, setStrengths] = useState(feedback?.strengths ?? '')
    const [improve, setImprove] = useState(feedback?.areas_to_improve ?? '')
    const [sentiment, setSentiment] = useState(feedback?.sentiment ?? '')
    const [employee, setEmployee] = useState(feedback?.employee_id)
    const [team, setTeam] = useState<User[]>()
    const [tags, setTags] = useState(feedback?.tags?.join(", ") ?? '');
    const [message, setMessage] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${baseUrl}/feedback/team/members`, { credentials: 'include' })
            const data = await res.json()
            setTeam(data)
        }
        if (role === 'manager') {
            fetchData()
        }
    }, [])
    console.log(employee)
    const handleSubmit = async () => {
        const body = {
            strengths,
            areas_to_improve: improve,
            sentiment,
            tags: tags.split(",").map(tag => tag.trim()),
            employee_id: employee
        };

        console.log(body)
        const endpoint = feedback?.id
            ? `/feedback/${feedback.id}`
            : `/feedback`;

        const method = feedback?.id ? "PATCH" : "POST";

        const res = await fetch(baseUrl + endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        if (res.ok) {
            if (id !== 0) {
                await fetch(baseUrl + `/feedback/request/${id}?new_status=fulfilled`, {
                    method: 'PATCH', headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
            }
            onClose()
        }
        else { alert("Something went wrong.") };
    };
    const request = async () => {
        const body = {
            message
        }
        const res = await fetch(`${baseUrl}/feedback/request`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        if (res.ok) onClose();
        else alert("Something went wrong.");

    }


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[10px] bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl'>{feedback?.id ? 'Edit' : 'Submit'}</h2>
                    <button onClick={onClose} className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-800">
                        <X />
                    </button>
                </div>
                {role === 'employee' ? <><input
                    type="text"
                    placeholder="message"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                    <button
                        className="mt-4 bg-[#4e3d9b] text-white px-4 py-2 rounded"
                        onClick={request}
                    >
                        Request
                    </button>
                </> : <div className='flex flex-col gap-2'>


                    <input
                        type="text"
                        placeholder="Strengths"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                        value={strengths}
                        onChange={e => setStrengths(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Area of Improvment"
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
                        onChange={e => { console.log("ji"); setEmployee(parseInt(e.target.value)) }}
                    >
                        <option value="">Select Employee</option>
                        {team?.map((items) => (
                            <option key={items.id} value={items.id} >{items.name}</option>
                        ))}

                    </select>
                    <button
                        className="mt-4 bg-[#4e3d9b] text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        {feedback?.id ? "Update Feedback" : "Submit Feedback"}
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default Modal