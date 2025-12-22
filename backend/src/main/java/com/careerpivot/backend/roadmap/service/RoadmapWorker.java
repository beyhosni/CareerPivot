package com.careerpivot.backend.roadmap.service;

import com.careerpivot.backend.roadmap.domain.*;
import com.careerpivot.backend.roadmap.repository.RoadmapRepository;
import com.careerpivot.backend.roadmap.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapWorker {
    private final RoadmapRepository roadmapRepository;
    private final TaskRepository taskRepository;

    @Async
    public void processRoadmapGeneration(Integer roadmapId) {
        roadmapRepository.findById(roadmapId).ifPresent(roadmap -> {
            log.info("Worker processing roadmap: {}", roadmapId);
            try {
                int months = switch (roadmap.getHorizon()) {
                    case SIX_MONTHS -> 6;
                    case ONE_YEAR -> 12;
                    case TWO_YEARS -> 24;
                };
                int totalWeeks = months * 4;

                for (int i = 1; i <= totalWeeks; i++) {
                    Task task = Task.builder()
                            .roadmap(roadmap)
                            .weekNumber(i)
                            .title("Jalon " + i + ": Objectif défini")
                            .description("Action planifiée pour la semaine " + i)
                            .status(TaskStatus.TODO)
                            .build();
                    taskRepository.save(task);
                }

                roadmap.setStatus(RoadmapStatus.READY);
                roadmapRepository.save(roadmap);
                log.info("Worker completed roadmap: {}", roadmapId);
            } catch (Exception e) {
                log.error("Error in worker for roadmap {}", roadmapId, e);
                roadmap.setStatus(RoadmapStatus.ERROR);
                roadmapRepository.save(roadmap);
            }
        });
    }
}
