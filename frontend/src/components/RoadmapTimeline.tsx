"use client";

import { Calendar, CheckCircle2, Circle } from "lucide-react";
import RoadmapFeedback from "./RoadmapFeedback";

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

export default function RoadmapTimeline({ horizon, tasks, roadmapId }: Props) {
    const horizonTitle = {
        'SIX_MONTHS': '6 Mois (Concret)',
        'ONE_YEAR': '1 An (Structuré)',
        'TWO_YEARS': '2 Ans (Stratégique)'
    }[horizon as 'SIX_MONTHS' | 'ONE_YEAR' | 'TWO_YEARS'] || horizon;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                    Timeline: {horizonTitle}
                </h2>
                <div className="text-sm text-gray-500">
                    {tasks.filter(t => t.status === 'DONE').length} / {tasks.length} tâches complétées
                </div>
            </div>

            <div className="relative border-l-2 border-blue-100 ml-4">
                {tasks.length === 0 ? (
                    <p className="ml-8 text-gray-500 italic">Chargement des jalons...</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="mb-8 ml-8 relative">
                            {/* Dot */}
                            <div className={`absolute -left-[41px] p-1 bg-white rounded-full border-2 ${task.status === 'DONE' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}`}>
                                {task.status === 'DONE' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 fill-current" />}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Semaine {task.weekNumber}</span>
                                <h3 className="text-lg font-semibold text-gray-900 mt-1">{task.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{task.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <RoadmapFeedback roadmapId={roadmapId} />
        </div>
    );
}
