'use client'
import { useAuthContext } from '@/context/AuthContext'
import getBaseUrl from '@/lib/getBaseUrl';
import React, { useEffect, useState } from 'react'

type Feedback = {
    id: number;
    sentiment: string;
    strengths: string;
    areas_to_improve: string;
    timestamp: string;
};

type Stats = {
    total_feedback: number;
    sentiment_distribution: Record<string, number>;
};

const baseUrl = getBaseUrl();
const Dashboard = () => {
    const { authUser } = useAuthContext()
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Stats | Feedback[] | null>(null);

    useEffect(() => {
        const endpoint = authUser?.role === "manager" ? "/dashboard/manager" : "/dashboard/employee";
        console.log(authUser)
        if (authUser?.role) {
            fetch(baseUrl + endpoint, { credentials: "include" })
                .then((res) => res.json())
                .then((json) => {
                    setData(json);
                    setLoading(false);
                });
        }
    }, [authUser?.role]);

    if (loading || !data) return <p>Loading dashboard...</p>;
    if (authUser?.role === "manager") {
        const stats = data as Stats;
        return (
            <div className="space-y-4 p-4">
                <h2>Welcome {authUser.name}</h2>
                <p className="text-lg">Total Feedbacks: <strong>{stats.total_feedback}</strong></p>
                <div className='shadow-md border-[#4e3d9b] rounded border p-2'>
                    <p className="text-md font-medium">Sentiment Breakdown:</p>
                    <ul className="list-disc pl-6">
                        {Object.entries(stats.sentiment_distribution).map(([sentiment, count]) => (
                            <li key={sentiment}>
                                {sentiment}: {count}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    const feedbacks = data as Feedback[];
    return (
        <div className="space-y-4 ">
            <h2>Welcome {authUser?.name}</h2>
            <h2 className="text-lg font-semibold">Your Feedback Timeline</h2>
            {feedbacks?.map((fb) => (
                <div key={fb.id} className="border p-4 shadow-md border-[#4e3d9b] rounded">
                    <p className="text-sm text-gray-500">{new Date(fb.timestamp).toLocaleString()}</p>
                    <p><strong>Sentiment:</strong> {fb.sentiment}</p>
                    <p><strong>Strengths:</strong> {fb.strengths}</p>
                    <p><strong>Areas to Improve:</strong> {fb.areas_to_improve}</p>
                </div>
            ))}
        </div>
    )
}

export default Dashboard