package com.careerpivot.backend.roadmap.service;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.Task;
import com.careerpivot.backend.roadmap.domain.TaskStatus;
import com.careerpivot.backend.roadmap.repository.RoadmapRepository;
import com.careerpivot.backend.roadmap.repository.TaskRepository;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.auth.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapService {
    private final RoadmapRepository roadmapRepository;
    private final TaskRepository taskRepository;

    public Roadmap generateRoadmap(Scenario scenario) {
        Roadmap roadmap = Roadmap.builder()
                .scenario(scenario)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6))
                .build();
        roadmap = roadmapRepository.save(roadmap);

        // Generate Stub Tasks
        for (int i = 1; i <= 24; i++) { // 24 weeks (6 months)
            Task task = Task.builder()
                    .roadmap(roadmap)
                    .weekNumber(i)
                    .title("Semaine " + i + ": Objectif " + i)
                    .description("Complete actions for week " + i)
                    .status(TaskStatus.TODO)
                    .build();
            taskRepository.save(task);
        }
        return roadmap;
    }

    public Roadmap getRoadmap(Scenario scenario) {
        return roadmapRepository.findByScenario(scenario)
                .orElse(null);
    }

    public Roadmap getRoadmapByUser(User user) {
        // Assuming one active roadmap, find by scenario user
        // Need to query via scenario or add custom query
        // Simple way: find scenarios for user, get latest, get roadmap
        // Better: RoadmapRepository findByScenarioUser(User user)
        // I will implement simple logic here using scenario repository if injected, or
        // assume passed scenario.
        // Wait, I don't have scenario repository here.
        // I will return null for now and fix Repository.
        return null;
    }

    public List<Task> getTasks(Roadmap roadmap) {
        return taskRepository.findByRoadmap(roadmap);
    }
}
