"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, BarChart, Euro } from "lucide-react";

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/metrics")
            .then((res) => res.json())
            .then((data) => {
                setMetrics(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement des métriques...</div>;

    const stats = [
        { name: "Utilisateurs Totaux", value: metrics.totalUsers, icon: Users },
        { name: "Premium / Pro", value: `${metrics.premiumUsers} / ${metrics.proUsers}`, icon: Euro },
        { name: "Sessions Coaching", value: metrics.totalSessions, icon: GraduationCap },
        { name: "Roadmaps Prêtes", value: metrics.readyRoadmaps, icon: BarChart },
    ];

    return (
        <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Vue d'ensemble Backoffice</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
                        <dt>
                            <div className="absolute rounded-md bg-indigo-500 p-3">
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
