package com.careerpivot.backend.roadmap.service;

import com.careerpivot.backend.roadmap.domain.*;
import com.careerpivot.backend.roadmap.repository.RoadmapRepository;
import com.careerpivot.backend.roadmap.repository.TaskRepository;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.auth.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.careerpivot.backend.config.EventPublisher;
import com.careerpivot.backend.roadmap.repository.RoadmapFeedbackRepository;

@Service
@RequiredArgsConstructor
public class RoadmapService {
    private final RoadmapRepository roadmapRepository;
    private final TaskRepository taskRepository;
    private final RoadmapFeedbackRepository roadmapFeedbackRepository;
    private final EventPublisher eventPublisher;
    private final com.careerpivot.backend.config.AnalyticsService analyticsService;

    public List<Task> getTasksById(Integer roadmapId) {
        return roadmapRepository.findById(roadmapId)
                .map(taskRepository::findByRoadmap)
                .orElse(List.of());
    }

    public Roadmap getRoadmapByUser(User user) {
        return roadmapRepository.findByScenario_User(user)
                .stream()
                .findFirst()
                .orElse(null);
    }

    public Roadmap generateRoadmap(Scenario scenario) {
        return generateRoadmapForHorizon(scenario, RoadmapHorizon.SIX_MONTHS);
    }

    public Roadmap generateRoadmapForHorizon(Scenario scenario, RoadmapHorizon horizon) {
        int months = switch (horizon) {
            case SIX_MONTHS -> 6;
            case ONE_YEAR -> 12;
            case TWO_YEARS -> 24;
        };

        Roadmap roadmap = Roadmap.builder()
                .scenario(scenario)
                .horizon(horizon)
                .status(RoadmapStatus.GENERATING)
                .version(1)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(months))
                .build();

        roadmap = roadmapRepository.save(roadmap);

        // Async task generation via event (Scalable approach)
        eventPublisher.publish("ROADMAP_GEN_REQUESTED", roadmap.getId());
        analyticsService.trackRoadmapGenerated(horizon.name());

        return roadmap;
    }

    @Async
    public void generateTasksAsync(Roadmap roadmap, int totalWeeks) {
        try {
            // Simulate processing time
            Thread.sleep(2000);

            for (int i = 1; i <= totalWeeks; i++) {
                Task task = Task.builder()
                        .roadmap(roadmap)
                        .weekNumber(i)
                        .title("Jalon " + i + ": " + getStubTitle(roadmap.getHorizon(), i))
                        .description("Action concrète pour la semaine " + i + " du plan " + roadmap.getHorizon())
                        .status(TaskStatus.TODO)
                        .build();
                taskRepository.save(task);
            }

            roadmap.setStatus(RoadmapStatus.READY);
            roadmapRepository.save(roadmap);
        } catch (InterruptedException e) {
            roadmap.setStatus(RoadmapStatus.ERROR);
            roadmapRepository.save(roadmap);
        }
    }

    private String getStubTitle(RoadmapHorizon horizon, int week) {
        if (horizon == RoadmapHorizon.SIX_MONTHS)
            return "Action Concrète " + week;
        if (horizon == RoadmapHorizon.ONE_YEAR)
            return "Structuration " + week;
        return "Vision Stratégique " + week;
    }

    public Roadmap getRoadmap(Scenario scenario) {
        return roadmapRepository.findByScenario(scenario)
                .stream().findFirst().orElse(null);
    }

    public List<Roadmap> getRoadmaps(Scenario scenario) {
        return roadmapRepository.findByScenario(scenario);
    }

    public List<Task> getTasks(Roadmap roadmap) {
        return taskRepository.findByRoadmap(roadmap);
    }

    public RoadmapFeedback addFeedback(Roadmap roadmap, User coach, String comments, String suggestedAdjustments) {
        List<RoadmapFeedback> existing = roadmapFeedbackRepository.findByRoadmapOrderByVersionDesc(roadmap);
        int nextVersion = existing.isEmpty() ? 1 : existing.get(0).getVersion() + 1;

        RoadmapFeedback feedback = RoadmapFeedback.builder()
                .roadmap(roadmap)
                .coach(coach)
                .comments(comments)
                .suggestedAdjustments(suggestedAdjustments)
                .version(nextVersion)
                .createdAt(LocalDateTime.now())
                .build();

        return roadmapFeedbackRepository.save(feedback);
    }
}
