"use client";

import CoachDirectory from "@/components/CoachDirectory";
import Link from "next/link";

export default function CoachingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-2xl font-black text-blue-600 tracking-tighter">CAREERPIVOT.</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">Accompagnement Premium</h1>
                    <p className="mt-2 text-lg text-gray-600">Échangez avec des experts pour affiner votre transition et booster vos chances de succès.</p>
                </div>

                <CoachDirectory />
            </main>
        </div>
    );
}
