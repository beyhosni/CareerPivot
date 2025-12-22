"use client";

import { Calendar, CheckCircle2, Circle } from "lucide-react";
import RoadmapFeedback from "./RoadmapFeedback";
import { motion } from "framer-motion";
import { useUIConfig } from "@/context/UIConfigContext";

interface Task {
    id: number;
    weekNumber: number;
    title: string;
    description: string;
    status: string;
}

interface Props {
    horizon: string;
    tasks: Task[];
    roadmapId: number;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

export default function RoadmapTimeline({ horizon, tasks, roadmapId }: Props) {
    const { animationsEnabled } = useUIConfig();
    const horizonTitle = {
        'SIX_MONTHS': '6 Mois (Concret)',
        'ONE_YEAR': '1 An (Structuré)',
        'TWO_YEARS': '2 Ans (Stratégique)'
    }[horizon as 'SIX_MONTHS' | 'ONE_YEAR' | 'TWO_YEARS'] || horizon;

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Timeline: {horizonTitle}</h2>
                        <p className="text-sm text-gray-500 font-medium">Visualisation de votre stratégie opérationnelle</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                    <span className="text-sm font-bold text-gray-700">
                        {tasks.filter(t => t.status === 'DONE').length} / {tasks.length} complétées
                    </span>
                </div>
            </div>

            <motion.div
                className="relative border-l-2 border-blue-50 ml-4 mb-12"
                variants={animationsEnabled ? container : {}}
                initial="hidden"
                animate="show"
            >
                {tasks.length === 0 ? (
                    <p className="ml-8 text-gray-500 italic">Chargement des jalons...</p>
                ) : (
                    tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            variants={animationsEnabled ? item : {}}
                            className="mb-10 ml-8 relative group"
                        >
                            {/* Dot with pulse for IN_PROGRESS */}
                            <div className={`absolute -left-[45px] p-1.5 bg-white rounded-full border-2 transition-all ${task.status === 'DONE' ? 'border-green-500 text-green-500' :
                                    task.status === 'IN_PROGRESS' ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                                        'border-gray-300 text-gray-300'
                                }`}>
                                {task.status === 'DONE' ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Circle className={`w-5 h-5 ${task.status === 'IN_PROGRESS' ? 'fill-current animate-pulse' : ''}`} />
                                )}
                            </div>

                            <motion.div
                                whileHover={animationsEnabled ? { scale: 1.02, x: 10 } : {}}
                                className={`rounded-2xl p-6 transition-all border ${task.status === 'DONE' ? 'bg-green-50/30 border-green-100' :
                                        task.status === 'IN_PROGRESS' ? 'bg-blue-50/30 border-blue-100' :
                                            'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                                    }`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${task.status === 'DONE' ? 'text-green-600' : 'text-blue-600'
                                    }`}>Semaine {task.weekNumber}</span>
                                <h3 className="text-lg font-bold text-gray-900 mt-1">{task.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{task.description}</p>

                                {task.status === 'IN_PROGRESS' && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="flex h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="bg-blue-600"
                                                initial={{ width: 0 }}
                                                animate={{ width: '40%' }} // Mock progress
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-600">40%</span>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            <div className="mt-12 pt-12 border-t border-gray-100">
                <RoadmapFeedback roadmapId={roadmapId} />
            </div>
        </div>
    );
}
