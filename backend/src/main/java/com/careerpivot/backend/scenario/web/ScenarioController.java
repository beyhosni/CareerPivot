package com.careerpivot.backend.scenario.web;

import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.scenario.service.ScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scenarios")
@RequiredArgsConstructor
public class ScenarioController {

    private final ScenarioService scenarioService;

    @GetMapping
    public ResponseEntity<List<Scenario>> getScenarios(@AuthenticationPrincipal User user) {
        List<Scenario> scenarios = scenarioService.getScenarios(user);
        if (scenarios.isEmpty()) {
            scenarios = scenarioService.generateScenarios(user);
        }
        return ResponseEntity.ok(scenarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scenario> getScenario(@PathVariable Integer id) {
        return ResponseEntity.ok(scenarioService.getScenario(id));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Scenario> activateScenario(@AuthenticationPrincipal User user, @PathVariable Integer id) {
        return ResponseEntity.ok(scenarioService.activateScenario(user, id));
    }

    @GetMapping("/{id}/compare")
    public ResponseEntity<List<Scenario>> compareScenarios(@AuthenticationPrincipal User user,
            @PathVariable Integer id) {
        // Returns the requested scenario and all others for comparison
        return ResponseEntity.ok(scenarioService.getScenarios(user));
    }
}
