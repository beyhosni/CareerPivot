"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { logout } from "@/lib/auth";
import Link from "next/link";

interface Task {
    id: number;
    weekNumber: number;
    title: string;
    description: string;
    status: string;
}

interface Roadmap {
    id: number;
    scenario?: {
        title: string;
        description: string;
        riskLevel: string;
        score: number;
    };
    startDate: string;
    endDate: string;
}

export default function DashboardPage() {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const planRes = await api.get("/plan/current");
                if (planRes.data) {
                    setRoadmap(planRes.data);
                    const tasksRes = await api.get("/plan/tasks"); // Assuming this returns tasks for current user
                    // Wait, I updated backend to getTasks(@AuthPrincipal User) but implementation was stubbed.
                    // But if PlanController.getTasks calls something.. 
                    // Currently PlanController.getTasks returns empty list in my last edit?
                    // No, I need to fix PlanController.getTasks to actually fetch tasks.
                    // I'll fix that.
                    if (tasksRes.data) {
                        setTasks(tasksRes.data);
                    }
                }
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-blue-600">CareerPivot</h1>
                        </div>
                        <div className="flex items-center">
                            <button onClick={logout} className="text-gray-500 hover:text-gray-700">Se déconnecter</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {!roadmap ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900">Aucun plan trouvé</h2>
                        <p className="mt-2 text-gray-600">Veuillez compléter votre profil pour générer une stratégie.</p>
                        <Link href="/assessment" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">Commencer le questionnaire</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Scenario Card */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Votre Scénario: {roadmap.scenario?.title}</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">{roadmap.scenario?.description}</p>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Niveau de risque</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{roadmap.scenario?.riskLevel}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Score de faisabilité</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{roadmap.scenario?.score}/100</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Roadmap Tasks */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Roadmap 6 Mois</h3>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {tasks.length === 0 ? <li className="px-4 py-4 text-gray-500">Aucune tâche chargée (Stub)</li> :
                                    tasks.map((task) => (
                                        <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-blue-600 truncate">
                                                    {task.title} (Semaine {task.weekNumber})
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {task.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
