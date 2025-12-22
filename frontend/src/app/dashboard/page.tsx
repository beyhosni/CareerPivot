"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { logout } from "@/lib/auth";
import Link from "next/link";
import ScenarioComparison from "@/components/ScenarioComparison";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import NotificationCenter from "@/components/NotificationCenter";
import { LayoutDashboard, CreditCard, Users, ShieldCheck, LogOut } from "lucide-react";

interface Scenario {
    id: number;
    title: string;
    description: string;
    justification: string;
    score: number;
    effort: number;
    financialRisk: number;
    timeRequiredMonths: number;
    riskLevel: string;
    isActive: boolean;
}

interface Task {
    id: number;
    weekNumber: number;
    title: string;
    description: string;
    status: string;
}

interface Roadmap {
    id: number;
    horizon: string;
    status: string;
    startDate: string;
    endDate: string;
}

export default function DashboardPage() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedHorizon, setSelectedHorizon] = useState("SIX_MONTHS");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);

    const activeScenario = scenarios.find(s => s.isActive);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userRes = await api.get("/auth/me");
            setUser(userRes.data);

            const subRes = await api.get("/billing/subscription");
            setSubscription(subRes.data);

            const scenarioRes = await api.get("/scenarios");
            setScenarios(scenarioRes.data);
        } catch (error) {
            console.error("Failed to load dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoadmap = async (scenarioId: number, horizon: string) => {
        try {
            const res = await api.get(`/scenarios/${scenarioId}/roadmaps?horizon=${horizon}`);
            if (res.data && res.data.length > 0) {
                const roadmap = res.data[0];
                setCurrentRoadmap(roadmap);
                const tasksRes = await api.get(`/api/plan/tasks?roadmapId=${roadmap.id}`);
                setTasks(tasksRes.data);
            } else {
                const genRes = await api.post(`/scenarios/${scenarioId}/roadmaps/generate?horizon=${horizon}`);
                setCurrentRoadmap(genRes.data);
                setTasks([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeScenario) {
            fetchRoadmap(activeScenario.id, selectedHorizon);
        }
    }, [activeScenario?.id, selectedHorizon]);

    const handleSelectScenario = async (id: number) => {
        await api.post(`/scenarios/${id}/activate`);
        fetchData();
    };

    if (loading && scenarios.length === 0) return <div className="p-8 text-center italic">Initialisation de votre trajectoire...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-black text-blue-600 tracking-tighter">CAREERPIVOT.</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/pricing" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-600">
                                <CreditCard className="h-4 w-4" /> Offres
                            </Link>
                            {subscription?.plan === 'PREMIUM' && (
                                <Link href="/coaching" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-600">
                                    <Users className="h-4 w-4" /> Coaching
                                </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                                <Link href="/admin" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-600">
                                    <ShieldCheck className="h-4 w-4" /> Admin
                                </Link>
                            )}
                            <NotificationCenter />
                            <button onClick={logout} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                <LogOut className="h-4 w-4" /> Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
                {scenarios.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-bold text-gray-900">Tracez votre avenir</h2>
                        <p className="mt-4 text-gray-500 max-w-md mx-auto">Commençons par évaluer vos compétences et vos aspirations pour générer vos scénarios de transition.</p>
                        <Link href="/assessment" className="mt-8 inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">Commencer le questionnaire</Link>
                    </div>
                ) : (
                    <>
                        <ScenarioComparison scenarios={scenarios} onSelect={handleSelectScenario} />

                        {activeScenario && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm w-fit mx-auto border border-gray-100">
                                    {(['SIX_MONTHS', 'ONE_YEAR', 'TWO_YEARS'] as const).map((h) => (
                                        <button
                                            key={h}
                                            onClick={() => setSelectedHorizon(h)}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedHorizon === h
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {h === 'SIX_MONTHS' ? '6 Mois' : h === 'ONE_YEAR' ? '1 An' : '2 Ans'}
                                        </button>
                                    ))}
                                </div>

                                {currentRoadmap?.status === 'GENERATING' && (
                                    <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-blue-50">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-blue-600 font-medium">Génération de votre roadmap stratégique en cours...</p>
                                    </div>
                                )}

                                {currentRoadmap?.status === 'READY' && (
                                    <RoadmapTimeline horizon={selectedHorizon} tasks={tasks} roadmapId={currentRoadmap.id} />
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
