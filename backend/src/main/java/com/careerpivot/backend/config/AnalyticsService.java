package com.careerpivot.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class AnalyticsService {

    public void trackEvent(String eventName, Map<String, Object> properties) {
        // Log event without PII
        // In a real app, this would go to Mixpanel, Amplitude, or a custom metrics
        // table
        log.info("[ANALYTICS] Event: {} | Props: {}", eventName, properties);
    }

    public void trackRoadmapGenerated(String horizon) {
        trackEvent("roadmap_generated", Map.of("horizon", horizon));
    }

    public void trackTaskCompleted(Integer taskId) {
        trackEvent("task_completed", Map.of("taskId", taskId));
    }

    public void trackScenarioSwitched(Integer scenarioId) {
        trackEvent("scenario_switched", Map.of("scenarioId", scenarioId));
    }
}
