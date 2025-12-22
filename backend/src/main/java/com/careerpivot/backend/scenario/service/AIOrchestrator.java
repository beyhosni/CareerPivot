package com.careerpivot.backend.scenario.service;

import com.careerpivot.backend.config.FeatureToggleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIOrchestrator {
    private final FeatureToggleService featureToggleService;

    public String refineJustification(String original, Map<String, Object> context) {
        if (!featureToggleService.isEnabled("AI_PERSONALIZATION")) {
            return original;
        }

        // Mock AI interaction
        log.info("Refining justification with AI for context: {}", context);
        return original + " (Enrichi par IA: Ce parcours semble particulièrement adapté à votre profil analytique.)";
    }

    public String generateAIPrompt(String templateName, Map<String, Object> variables) {
        // Simple versioned prompt template logic
        return "System: Career Guide. User: " + variables.toString();
    }
}
