package com.careerpivot.backend.scenario.service;

import com.careerpivot.backend.assessment.domain.Assessment;
import com.careerpivot.backend.assessment.service.AssessmentService;
import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.scenario.repository.ScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScenarioService {
    private final AssessmentService assessmentService;
    private final ScenarioRepository scenarioRepository;

    public Scenario generateScenario(User user) {
        Assessment assessment = assessmentService.getAssessment(user);
        Map<String, Object> answers = assessment.getAnswers();

        // Simple logic stub
        int hoursPerWeek = 0;
        if (answers != null && answers.containsKey("hoursPerWeek")) {
            hoursPerWeek = Integer.parseInt(answers.get("hoursPerWeek").toString());
        }

        String title;
        String description;
        String risk;

        if (hoursPerWeek < 5) {
            title = "Pivot Adjacent";
            description = "Optimisation de votre poste actuel et transition douce.";
            risk = "LOW";
        } else {
            title = "Reconversion Totale";
            description = "Formation intensive et changement de secteur.";
            risk = "HIGH";
        }

        Scenario scenario = Scenario.builder()
                .user(user)
                .title(title)
                .description(description)
                .riskLevel(risk)
                .score(85)
                .build();

        return scenarioRepository.save(scenario);
    }
}
