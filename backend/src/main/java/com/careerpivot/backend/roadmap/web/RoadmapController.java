package com.careerpivot.backend.roadmap.web;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.RoadmapHorizon;
import com.careerpivot.backend.roadmap.service.RoadmapService;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.scenario.service.ScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scenarios/{scenarioId}/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final ScenarioService scenarioService;

    @GetMapping
    public ResponseEntity<List<Roadmap>> getRoadmaps(@PathVariable Integer scenarioId,
            @RequestParam(required = false) RoadmapHorizon horizon) {
        Scenario scenario = scenarioService.getScenario(scenarioId);
        if (scenario == null)
            return ResponseEntity.notFound().build();

        List<Roadmap> roadmaps = roadmapService.getRoadmaps(scenario);
        if (horizon != null) {
            roadmaps = roadmaps.stream().filter(r -> r.getHorizon() == horizon).toList();
        }
        return ResponseEntity.ok(roadmaps);
    }

    @PostMapping("/generate")
    public ResponseEntity<Roadmap> generateRoadmap(@PathVariable Integer scenarioId,
            @RequestParam RoadmapHorizon horizon) {
        Scenario scenario = scenarioService.getScenario(scenarioId);
        if (scenario == null)
            return ResponseEntity.notFound().build();

        Roadmap roadmap = roadmapService.generateRoadmapForHorizon(scenario, horizon);
        return ResponseEntity.ok(roadmap);
    }
}
