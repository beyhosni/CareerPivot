package com.careerpivot.backend.config;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class FeatureToggleService {
    private final Map<String, Boolean> toggles = new HashMap<>();

    public FeatureToggleService() {
        // AI is disabled by default in MVP Phase 2 initial startup
        toggles.put("AI_PERSONALIZATION", false);
    }

    public boolean isEnabled(String feature) {
        return toggles.getOrDefault(feature, false);
    }
}
