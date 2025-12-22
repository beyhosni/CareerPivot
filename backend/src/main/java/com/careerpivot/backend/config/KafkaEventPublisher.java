package com.careerpivot.backend.config;

import com.careerpivot.backend.roadmap.service.RoadmapWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventPublisher implements EventPublisher {
    private final RoadmapWorker roadmapWorker;

    @Override
    public void publish(String topic, Object payload) {
        log.info("[KAFKA] Publishing to topic {}: {}", topic, payload);

        if ("ROADMAP_GEN_REQUESTED".equals(topic) && payload instanceof Integer roadmapId) {
            roadmapWorker.processRoadmapGeneration(roadmapId);
        }
    }
}
