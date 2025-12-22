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
        Scenario scenario = scenarioService.generateScenario(user);
        Roadmap roadmap = roadmapService.generateRoadmap(scenario);
        return ResponseEntity.ok(roadmap);
    }

    @GetMapping("/current")
    public ResponseEntity<Roadmap> getCurrentPlan(@AuthenticationPrincipal User user) {
        Roadmap roadmap = roadmapService.getRoadmapByUser(user);
        return ResponseEntity.ok(roadmap);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks(@AuthenticationPrincipal User user) {
        // Find scenario for user, then roadmap, then tasks
        // Simplified: generate if not exists? Or just get.
        // For MVP, we assume one scenario per user.
        // Implement get logic properly in services later.
        // For now, simple flow through generation or error if not found?
        // Let's implement retrieving:
        return ResponseEntity.ok(List.of()); // Stub for now or need getByUSer logic
    }
}
