"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, PerspectiveCamera, OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function DeformingPath({ time, risk, revenue }: { time: number, risk: number, revenue: number }) {
    const lineRef = useRef<any>(null!);

    const points = useMemo(() => {
        const pts = [];
        const segments = 50;
        // Base length depends on time
        const length = 5 + (time / 20) * 5;
        // Slope depends on revenue
        const slope = (revenue / 100000) * 3;
        // Amplitude of waves depends on risk
        const noise = risk / 10;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = t * length - length / 2;
            const y = t * slope + Math.sin(t * Math.PI * 4) * (t * noise);
            const z = Math.cos(t * Math.PI * 2) * (t * noise * 0.5);
            pts.push(new THREE.Vector3(x, y, z));
        }
        return pts;
    }, [time, risk, revenue]);

    return (
        <group>
            <Line
                ref={lineRef}
                points={points}
                color={risk > 7 ? "#ef4444" : "#3b82f6"}
                lineWidth={3}
                dashed={false}
            />
            {/* Glow effect simplified with multiple lines or just a fat transparent line */}
            <Line
                points={points}
                color={risk > 7 ? "#ef4444" : "#3b82f6"}
                lineWidth={10}
                transparent
                opacity={0.2}
            />

            {/* Start and End nodes */}
            <mesh position={points[0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#fff" emissive="#3b82f6" emissiveIntensity={2} />
            </mesh>
            <mesh position={points[points.length - 1]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#fff" emissive={risk > 7 ? "#ef4444" : "#22c55e"} emissiveIntensity={2} />
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.2}
                    color="#fff"
                >
                    Cible
                </Text>
            </mesh>
        </group>
    );
}

import { useUIConfig } from "@/context/UIConfigContext";

export default function WhatIfSimulator() {
    const [time, setTime] = useState(10); // hours/week
    const [risk, setRisk] = useState(3);  // 1-10
    const [revenue, setRevenue] = useState(50000); // targeted revenue
    const { animationsEnabled } = useUIConfig();

    const handleSliderStop = () => {
        console.log("Triggering backend recalculation for:", { time, risk, revenue });
        // In a real app, this would call api.post('/scenarios/simulate', { ... })
    };

    if (!animationsEnabled) {
        return (
            <div className="bg-slate-900 p-8 rounded-3xl text-center border border-gray-800">
                <p className="text-gray-400">Le simulateur 3D est désactivé. Veuillez activer les animations pour y accéder.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-slate-950 p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            {/* Controls */}
            <div className="space-y-8 flex flex-col justify-center">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Simulateur Stratégique</h3>
                    <p className="text-gray-500 text-sm mt-1">Ajustez vos paramètres pour visualiser l'impact sur votre trajectoire.</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Temps (h/semaine)</label>
                            <span className="text-blue-400 font-mono text-sm">{time}h</span>
                        </div>
                        <input
                            type="range" min="5" max="40" step="5"
                            value={time}
                            onChange={(e) => setTime(parseInt(e.target.value))}
                            onMouseUp={handleSliderStop}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Niveau de Risque</label>
                            <span className={`font-mono text-sm ${risk > 7 ? 'text-red-400' : 'text-blue-400'}`}>{risk}/10</span>
                        </div>
                        <input
                            type="range" min="1" max="10" step="1"
                            value={risk}
                            onChange={(e) => setRisk(parseInt(e.target.value))}
                            onMouseUp={handleSliderStop}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Objectif Revenu (€)</label>
                            <span className="text-blue-400 font-mono text-sm">{revenue.toLocaleString()}€</span>
                        </div>
                        <input
                            type="range" min="30000" max="150000" step="5000"
                            value={revenue}
                            onChange={(e) => setRevenue(parseInt(e.target.value))}
                            onMouseUp={handleSliderStop}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <p className="text-[10px] text-blue-400 font-medium leading-relaxed">
                        <span className="font-bold">NOTE:</span> Cette simulation utilise notre moteur de calcul prédictif pour estimer la viabilité de votre projet en temps réel.
                    </p>
                </div>
            </div>

            {/* 3D Visualization */}
            <div className="lg:col-span-2 h-[450px] relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
                <Canvas shadows>
                    <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <DeformingPath time={time} risk={risk} revenue={revenue} />

                    <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -2, 0]} />
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 4} />
                </Canvas>

                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${risk > 7 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                            {risk > 7 ? 'Instabilité élevée' : 'Trajectoire saine'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
