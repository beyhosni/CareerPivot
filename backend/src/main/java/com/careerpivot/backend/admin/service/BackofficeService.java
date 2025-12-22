package com.careerpivot.backend.admin.service;

import com.careerpivot.backend.billing.domain.SubscriptionPlan;
import com.careerpivot.backend.billing.repository.SubscriptionRepository;
import com.careerpivot.backend.coaching.repository.CoachingSessionRepository;
import com.careerpivot.backend.roadmap.repository.RoadmapRepository;
import com.careerpivot.backend.roadmap.domain.RoadmapStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BackofficeService {

    private final SubscriptionRepository subscriptionRepository;
    private final CoachingSessionRepository sessionRepository;
    private final RoadmapRepository roadmapRepository;

    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // User Distribution
        long totalUsers = subscriptionRepository.count();
        long premiumUsers = subscriptionRepository.findAll().stream()
                .filter(s -> s.getPlan() == SubscriptionPlan.PREMIUM).count();
        long proUsers = subscriptionRepository.findAll().stream()
                .filter(s -> s.getPlan() == SubscriptionPlan.PRO).count();

        metrics.put("totalUsers", totalUsers);
        metrics.put("premiumUsers", premiumUsers);
        metrics.put("proUsers", proUsers);

        // Coaching Sessions
        metrics.put("totalSessions", sessionRepository.count());
        metrics.put("completedSessions", sessionRepository.findByStatus("COMPLETED").size());
        metrics.put("pendingSessions", sessionRepository.findByStatus("REQUESTED").size());

        // Roadmap Readiness
        metrics.put("readyRoadmaps", roadmapRepository.findAll().stream()
                .filter(r -> r.getStatus() == RoadmapStatus.READY).count());

        return metrics;
    }
}
