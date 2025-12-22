"use client";

import { useEffect, useState } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import api from "@/lib/axios";

interface Feedback {
    id: number;
    comments: string;
    suggestedAdjustments: string;
    version: number;
    coach: {
        firstname: string;
        lastname: string;
    };
    createdAt: string;
}

export default function RoadmapFeedback({ roadmapId }: { roadmapId: number }) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/roadmaps/${roadmapId}/feedback`)
            .then((res) => {
                setFeedbacks(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [roadmapId]);

    if (loading) return null;
    if (feedbacks.length === 0) return null;

    return (
        <div className="mt-8 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Retours du Coach
            </h3>
            <div className="space-y-4">
                {feedbacks.map((f) => (
                    <div key={f.id} className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                            v{f.version}
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <AlertCircle className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    {f.coach.firstname} {f.coach.lastname}
                                </p>
                                <p className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</p>

                                <div className="mt-3 text-sm text-gray-700 leading-relaxed italic">
                                    "{f.comments}"
                                </div>

                                {f.suggestedAdjustments && (
                                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Ajustements suggérés</p>
                                        <p className="mt-1 text-sm text-gray-600">{f.suggestedAdjustments}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
