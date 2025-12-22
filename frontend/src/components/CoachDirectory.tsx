"use client";

import { useEffect, useState } from "react";
import { User, Star, Video } from "lucide-react";

interface Coach {
    id: number;
    firstname: string;
    lastname: string;
    bio: string;
    expertise: string;
    languages: string;
    industry: string;
    pricePerSession: number;
}

export default function CoachDirectory() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/coaching/coaches")
            .then((res) => res.json())
            .then((data) => {
                setCoaches(data);
                setLoading(false);
            });
    }, []);

    const handleBookSession = async (coachId: number) => {
        setBooking(coachId);
        try {
            const res = await fetch("/api/coaching/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    coachId,
                    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                }),
            });
            if (res.ok) {
                alert("Session demandée avec succès ! Le coach vous contactera pour confirmer.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setBooking(null);
        }
    };

    if (loading) return <div>Chargement des coaches...</div>;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
                <div key={coach.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-x-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{coach.firstname} {coach.lastname}</h3>
                            <p className="text-sm text-indigo-600 font-medium">{coach.industry}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">{coach.bio || "Pas de bio disponible."}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {coach.expertise?.split(",").map(exp => (
                            <span key={exp} className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">{exp.trim()}</span>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{coach.pricePerSession}€ <span className="text-sm font-normal text-gray-500">/ session</span></span>
                        <button
                            onClick={() => handleBookSession(coach.id)}
                            disabled={booking === coach.id}
                            className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                        >
                            <Video className="h-4 w-4" />
                            {booking === coach.id ? "Réservation..." : "Réserver"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
