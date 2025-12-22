"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, MeshDistortMaterial, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function AbstractAvatar({ position }: { position: [number, number, number] }) {
    const mesh = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 2;
        mesh.current.rotation.y = Math.sin(t / 4) / 2;
        mesh.current.position.y = position[1] + Math.sin(t / 1.5) / 10;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={mesh} position={position}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <MeshDistortMaterial
                    color="#3b82f6"
                    speed={3}
                    distort={0.4}
                    radius={1}
                />
            </mesh>
        </Float>
    );
}

function PathStep({ position, label, active }: { position: [number, number, number], label: string, active: boolean }) {
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={active ? "#3b82f6" : "#cbd5e1"} emissive={active ? "#3b82f6" : "#000"} emissiveIntensity={0.5} />
            </mesh>
            <Text
                position={[0, -0.4, 0]}
                fontSize={0.2}
                color={active ? "#1e40af" : "#64748b"}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZfO.woff"
            >
                {label}
            </Text>
        </group>
    );
}

const steps = ["Maintenant", "Transition", "Cible"];

import { useUIConfig } from "@/context/UIConfigContext";

export default function Onboarding3D() {
    const [currentStep, setCurrentStep] = useState(0);
    const { animationsEnabled } = useUIConfig();

    // Map step to target camera Z or Avatar X position
    const avatarPosition = useMemo((): [number, number, number] => [currentStep * 2 - 2, 0, 0], [currentStep]);

    if (!animationsEnabled) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8 py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="flex space-x-12">
                    {steps.map((label, i) => (
                        <div key={label} className="text-center">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold ${i === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                            <p className={`mt-2 font-medium ${i === currentStep ? 'text-blue-900' : 'text-gray-400'}`}>{label}</p>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-4">
                    <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} className="px-4 py-2 bg-white border rounded-lg text-sm">Précédent</button>
                    <button onClick={() => setCurrentStep(prev => Math.min(2, prev + 1))} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Suivant</button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[400px] w-full bg-slate-900 rounded-3xl shadow-2xl overflow-hidden group">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <AbstractAvatar position={avatarPosition} />

                <group position={[0, -1, 0]}>
                    {steps.map((label, i) => (
                        <PathStep
                            key={label}
                            position={[i * 2 - 2, 0, 0]}
                            label={label}
                            active={i <= currentStep}
                        />
                    ))}
                    {/* Path Line */}
                    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 4]} />
                        <meshStandardMaterial color="#334155" />
                    </mesh>
                </group>

                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl text-center pointer-events-auto"
                    >
                        <h4 className="text-blue-900 font-bold">{steps[currentStep]}</h4>
                        <p className="text-gray-500 text-xs mt-1">
                            {currentStep === 0 && "Évaluation de votre point de départ."}
                            {currentStep === 1 && "Optimisation de votre trajectoire."}
                            {currentStep === 2 && "Atteinte de vos nouveaux objectifs."}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex space-x-3 mt-6 pointer-events-auto">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white border border-white/30 transition-all disabled:opacity-30"
                        disabled={currentStep === 0}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => setCurrentStep(prev => Math.min(2, prev + 1))}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all disabled:opacity-30"
                        disabled={currentStep === 2}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-auto">
                <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded border border-indigo-400/30 uppercase tracking-widest">
                    3D Reality Engine
                </span>
            </div>
        </div>
    );
}
