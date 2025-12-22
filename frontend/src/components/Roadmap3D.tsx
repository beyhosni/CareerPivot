"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text, Float, OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface Task {
    id: number;
    weekNumber: number;
    title: string;
    status: string;
}

function MilestoneNode({ position, task, active }: { position: [number, number, number], task: Task, active: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const statusColor = useMemo(() => {
        if (task.status === 'DONE') return "#22c55e";
        if (task.status === 'IN_PROGRESS') return "#3b82f6";
        return "#94a3b8";
    }, [task.status]);

    useFrame((state) => {
        if (task.status === 'IN_PROGRESS') {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial
                    color={statusColor}
                    emissive={statusColor}
                    emissiveIntensity={task.status === 'IN_PROGRESS' ? 2 : 0.5}
                />
            </mesh>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.15}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZfO.woff"
                >
                    {`S${task.weekNumber}: ${task.title}`}
                </Text>
            </Float>

            {/* Connection line back to center */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4]} />
                <meshStandardMaterial color="#334155" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}

function CameraController({ horizon }: { horizon: string }) {
    const { camera } = useThree();

    useEffect(() => {
        let targetZ = 8;
        if (horizon === 'SIX_MONTHS') targetZ = 6;
        if (horizon === 'ONE_YEAR') targetZ = 12;
        if (horizon === 'TWO_YEARS') targetZ = 18;

        new THREE.Vector3(0, 0, targetZ);
        // Logic for smooth transition would go here if using a lib, but we can just snap or use simple lerp
        camera.position.z = targetZ;
    }, [horizon, camera]);

    return null;
}

import { useUIConfig } from "@/context/UIConfigContext";

export default function Roadmap3D({ tasks, horizon }: { tasks: Task[], horizon: string }) {
    const { animationsEnabled } = useUIConfig();

    if (!animationsEnabled || tasks.length === 0) {
        return (
            <div className="h-[500px] w-full bg-gray-900 rounded-3xl flex items-center justify-center p-8 text-center border border-gray-800">
                <div>
                    <p className="text-gray-400 text-sm">Visualisation 3D en cours de chargement ou désactivée.</p>
                    <p className="text-gray-600 text-xs mt-2 italic">Device low-motion detection active.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[600px] w-full bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl shadow-inner overflow-hidden border border-white/5">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
                <CameraController horizon={horizon} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} castShadow />
                <spotLight position={[0, 15, 0]} intensity={1.5} angle={0.2} penumbra={1} castShadow />

                <Environment preset="city" />

                <group rotation={[0.4, 0, 0]}>
                    {/* Central Timeline Core */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 15, 32]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                    </mesh>

                    {/* Tasks as Spiral Nodes */}
                    {tasks.map((task, i) => {
                        const angle = (i / tasks.length) * Math.PI * 4; // 2 full spirals
                        const radius = 1.5;
                        const spread = 12;
                        const z = (i / tasks.length) * spread - spread / 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * (radius * 0.5);

                        return (
                            <MilestoneNode
                                key={task.id}
                                position={[x, y, z]}
                                task={task}
                                active={true}
                            />
                        );
                    })}
                </group>

                <OrbitControls
                    enablePan={false}
                    maxDistance={25}
                    minDistance={4}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 4}
                />

                {/* Decorative Grid */}
                <gridHelper args={[30, 30, "#1e293b", "#0f172a"]} position={[0, -2, 0]} />
            </Canvas>

            {/* Labels / Legend */}
            <div className="absolute top-6 left-6 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Terminé</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">En cours</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400 shadow-[0_0_10px_#94a3b8]" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">À venir</span>
                </div>
            </div>

            <div className="absolute bottom-6 right-6">
                <p className="text-[10px] text-gray-600 font-mono">RENDER_MODE: WEBGL_PRECISION_HIGH</p>
            </div>
        </div>
    );
}
