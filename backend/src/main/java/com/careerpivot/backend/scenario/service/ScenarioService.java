package com.careerpivot.backend.scenario.service;

import com.careerpivot.backend.assessment.domain.Assessment;
import com.careerpivot.backend.assessment.service.AssessmentService;
import com.careerpivot.backend.auth.domain.User;
import com.careerpivot.backend.scenario.domain.Scenario;
import com.careerpivot.backend.scenario.repository.ScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScenarioService {
    private final AssessmentService assessmentService;
    private final ScenarioRepository scenarioRepository;
    private final RulesEngine rulesEngine;
    private final AIOrchestrator aiOrchestrator;
    private final com.careerpivot.backend.config.AnalyticsService analyticsService;

    public List<Scenario> generateScenarios(User user) {
        analyticsService.trackEvent("scenarios_generated", Map.of("userId", user.getId()));
        Assessment assessment = assessmentService.getAssessment(user);
        Map<String, Object> answers = (assessment != null) ? assessment.getAnswers() : Map.of();

        List<Scenario> scenarios = new ArrayList<>();

        // 1. Pivot Adjacent
        String adjJust = "Basé sur votre expérience actuelle, ce scénario minimise les risques en capitalisant sur vos compétences transférables.";
        scenarios.add(Scenario.builder()
                .user(user)
                .title("Pivot Adjacent")
                .description("Optimisation de votre poste actuel et transition douce vers un rôle connexe.")
                .justification(aiOrchestrator.refineJustification(adjJust, answers))
                .score(rulesEngine.calculateScore("adjacent", answers))
                .effort(rulesEngine.getEffort("adjacent"))
                .financialRisk(rulesEngine.getRisk("adjacent"))
                .timeRequiredMonths(6)
                .riskLevel("LOW")
                .isActive(true)
                .build());

        // 2. Pivot Hybride
        String hybJust = "Ce scénario vous permet de maintenir une activité tout en préparant votre futur rôle via des formations ciblées.";
        scenarios.add(Scenario.builder()
                .user(user)
                .title("Pivot Hybride")
                .description("Combinaison de montée en compétences et transition progressive.")
                .justification(aiOrchestrator.refineJustification(hybJust, answers))
                .score(rulesEngine.calculateScore("hybride", answers))
                .effort(rulesEngine.getEffort("hybride"))
                .financialRisk(rulesEngine.getRisk("hybride"))
                .timeRequiredMonths(12)
                .riskLevel("MEDIUM")
                .isActive(false)
                .build());

        // 3. Pivot Progressif
        String proJust = "Idéal si vous souhaitez changer radicalement tout en sécurisant chaque étape de votre parcours.";
        scenarios.add(Scenario.builder()
                .user(user)
                .title("Pivot Progressif")
                .description("Transition par étapes sur le long terme.")
                .justification(aiOrchestrator.refineJustification(proJust, answers))
                .score(rulesEngine.calculateScore("progressif", answers))
                .effort(rulesEngine.getEffort("progressif"))
                .financialRisk(rulesEngine.getRisk("progressif"))
                .timeRequiredMonths(24)
                .riskLevel("LOW")
                .isActive(false)
                .build());

        // 4. Pivot Sécurisé
        String secJust = "Ce scénario priorise la stabilité financière et la validation de chaque jalon avant de quitter votre poste actuel.";
        scenarios.add(Scenario.builder()
                .user(user)
                .title("Pivot Sécurisé")
                .description("Changement de secteur avec filet de sécurité financier.")
                .justification(aiOrchestrator.refineJustification(secJust, answers))
                .score(rulesEngine.calculateScore("securise", answers))
                .effort(rulesEngine.getEffort("securise"))
                .financialRisk(rulesEngine.getRisk("securise"))
                .timeRequiredMonths(18)
                .riskLevel("LOW")
                .isActive(false)
                .build());

        return (List<Scenario>) scenarioRepository.saveAll(scenarios);
    }

    public List<Scenario> getScenarios(User user) {
        return scenarioRepository.findByUser(user);
    }

    public Scenario getScenario(Integer id) {
        return scenarioRepository.findById(id).orElse(null);
    }

    public Scenario activateScenario(User user, Integer scenarioId) {
        List<Scenario> userScenarios = scenarioRepository.findByUser(user);
        Scenario target = null;
        for (Scenario s : userScenarios) {
            if (s.getId().equals(scenarioId)) {
                s.setActive(true);
                target = s;
            } else {
                s.setActive(false);
            }
        }
        scenarioRepository.saveAll(userScenarios);
        if (target != null) {
            analyticsService.trackScenarioSwitched(scenarioId);
        }
        return target;
    }
}
