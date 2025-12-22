"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UIConfig {
    animationsEnabled: boolean;
    setAnimationsEnabled: (enabled: boolean) => void;
    reducedMotion: boolean;
}

const UIConfigContext = createContext<UIConfig | undefined>(undefined);

export function UIConfigProvider({ children }: { children: React.ReactNode }) {
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Check for system preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);

        // Auto-disable if system prefers reduced motion
        if (mediaQuery.matches) {
            setAnimationsEnabled(false);
        }

        const handler = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
            if (e.matches) setAnimationsEnabled(false);
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return (
        <UIConfigContext.Provider value={{ animationsEnabled, setAnimationsEnabled, reducedMotion }}>
            {children}
        </UIConfigContext.Provider>
    );
}

export function useUIConfig() {
    const context = useContext(UIConfigContext);
    if (context === undefined) {
        throw new Error("useUIConfig must be used within a UIConfigProvider");
    }
    return context;
}
