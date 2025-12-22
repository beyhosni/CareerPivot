"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const assessmentSchema = z.object({
    currentRole: z.string().min(2),
    skills: z.string().min(2),
    goals: z.string().min(2),
    hoursPerWeek: z.coerce.number().min(1).max(168),
    financialStatus: z.string().min(2),
    constraints: z.string().optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

export default function AssessmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<AssessmentFormData>({
        resolver: zodResolver(assessmentSchema) as any,
    });

    const onSubmit = async (data: AssessmentFormData) => {
        setLoading(true);
        try {
            // 1. Save Assessment
            await api.post("/assessment", { answers: data });

            // 2. Generate Plan
            await api.post("/plan/generate");

            // 3. Redirect
            router.push("/dashboard");
        } catch (error) {
            console.error("Submission failed", error);
            alert("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Questionnaire de Profilage</h1>
                <p className="mb-8 text-gray-600">Aidez-nous à construire votre stratégie de transition.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Poste actuel</label>
                        <input {...register("currentRole")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: Chef de projet" />
                        {errors.currentRole && <span className="text-red-500 text-sm">{errors.currentRole.message}</span>}
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Compétences principales (séparées par des virgules)</label>
                        <textarea {...register("skills")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={3} placeholder="Ex: Java, Gestion d'équipe, Marketing..." />
                        {errors.skills && <span className="text-red-500 text-sm">{errors.skills.message}</span>}
                    </div>

                    {/* Goals */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Objectif professionnel</label>
                        <textarea {...register("goals")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" rows={3} placeholder="Ex: Devenir développeur Freelance..." />
                        {errors.goals && <span className="text-red-500 text-sm">{errors.goals.message}</span>}
                    </div>

                    {/* Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Heures disponibles par semaine pour la transition</label>
                        <input type="number" {...register("hoursPerWeek")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: 5" />
                        {errors.hoursPerWeek && <span className="text-red-500 text-sm">{errors.hoursPerWeek.message}</span>}
                    </div>

                    {/* Financial */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Situation financière</label>
                        <select {...register("financialStatus")} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="">Sélectionnez...</option>
                            <option value="secure">Confortable (6 mois+ d'avance)</option>
                            <option value="ok">Stable (3 mois d'avance)</option>
                            <option value="tight">Tendue (Besoin de revenus rapides)</option>
                        </select>
                        {errors.financialStatus && <span className="text-red-500 text-sm">{errors.financialStatus.message}</span>}
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300">
                        {loading ? "Génération en cours..." : "Générer ma Roadmap"}
                    </button>
                </form>
            </div>
        </div>
    );
}
