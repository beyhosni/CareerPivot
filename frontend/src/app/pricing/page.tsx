"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        id: "FREE",
        price: "0€",
        description: "Pour explorer vos options.",
        features: ["1 scénario", "Roadmap 6 mois", "Suivi basique"],
        cta: "Commencer gratuitement",
    },
    {
        name: "Pro",
        id: "PRO",
        price: "29€",
        description: "Pour un pivot sérieux et efficace.",
        features: [
            "Scénarios illimités",
            "Roadmaps 6m / 1y / 2y",
            "IA avancée",
            "Exports PDF",
            "Notifications intelligentes",
        ],
        cta: "Devenir Pro",
    },
    {
        name: "Premium",
        id: "PREMIUM",
        price: "99€",
        description: "L'accompagnement ultime avec coach.",
        features: [
            "Tout le plan Pro",
            "Sessions avec coach certifié",
            "Feedback personnalisé",
            "Accès prioritaire",
        ],
        cta: "Passer Premium",
    },
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (planId: string) => {
        if (planId === "FREE") return;
        setLoading(planId);
        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });
            const { url } = await res.json();
            window.location.href = url;
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Tarification</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Choisissez le plan qui propulsera votre carrière
                    </p>
                </div>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {plans.map((plan, idx) => (
                        <div
                            key={plan.id}
                            className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${idx === 1 ? "lg:z-10 lg:scale-110 ring-indigo-600" : ""
                                }`}
                        >
                            <div>
                                <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                                <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/mois</span>
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={!!loading}
                                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${idx === 1
                                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                    : "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300"
                                    }`}
                            >
                                {loading === plan.id ? "Redirection..." : plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
