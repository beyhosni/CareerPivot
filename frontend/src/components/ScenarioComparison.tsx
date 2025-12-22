"use client";

import { CheckCircle } from "lucide-react";

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

interface Props {
    scenarios: Scenario[];
    onSelect: (id: number) => void;
}

export default function ScenarioComparison({ scenarios, onSelect }: Props) {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Comparez vos parcours</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critères</th>
                        {scenarios.map(s => (
                            <th key={s.id} className={`px-6 py-3 text-center text-sm font-bold ${s.isActive ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                                {s.title}
                                {s.isActive && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Actif</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Score de faisabilité</td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-center">
                                <div className="text-lg font-bold text-blue-600">{s.score}%</div>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Effort estimé</td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px] mx-auto">
                                    <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${s.effort}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-500">{s.effort}%</span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risque financier</td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-center text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.financialRisk > 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {s.financialRisk}%
                                </span>
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Temps requis</td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-center text-sm text-gray-500">
                                {s.timeRequiredMonths} mois
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Justification</td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-sm text-gray-500 italic max-w-xs">
                                {s.justification}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>
                        {scenarios.map(s => (
                            <td key={s.id} className="px-6 py-4 text-center">
                                {s.isActive ? (
                                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg flex items-center mx-auto text-sm font-bold">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Sélectionné
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (confirm(`Êtes-vous sûr de vouloir activer le scénario "${s.title}" ? Cela mettra à jour votre roadmap 3D.`)) {
                                                onSelect(s.id);
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-md hover:shadow-lg"
                                    >
                                        Activer
                                    </button>
                                )}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
