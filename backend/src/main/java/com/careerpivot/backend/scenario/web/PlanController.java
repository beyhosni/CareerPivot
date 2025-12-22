package com.careerpivot.backend.scenario.web;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.Task;
import com.careerpivot.backend.roadmap.service.RoadmapService;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.scenario.service.ScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plan")
@RequiredArgsConstructor
public class PlanController {

    private final ScenarioService scenarioService;
    private final RoadmapService roadmapService;

    @PostMapping("/generate")
    public ResponseEntity<Roadmap> generatePlan(@AuthenticationPrincipal User user) {
        List<Scenario> scenarios = scenarioService.generateScenarios(user);
        Scenario scenario = scenarios.get(0); // Take first as default for legacy endpoint
        Roadmap roadmap = roadmapService.generateRoadmap(scenario);
        return ResponseEntity.ok(roadmap);
    }

    @GetMapping("/current")
    public ResponseEntity<Roadmap> getCurrentPlan(@AuthenticationPrincipal User user) {
        Roadmap roadmap = roadmapService.getRoadmapByUser(user);
        return ResponseEntity.ok(roadmap);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks(@RequestParam(required = false) Integer roadmapId) {
        if (roadmapId != null) {
            return ResponseEntity.ok(roadmapService.getTasksById(roadmapId));
        }
        return ResponseEntity.ok(List.of());
    }
}
