package com.careerpivot.backend.scenario.service;

import com.careerpivot.backend.config.RulesConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RulesEngine {
    private final RulesConfig rulesConfig;

    public int calculateScore(String scenarioType, Map<String, Object> answers) {
        RulesConfig.ScenarioRule rule = rulesConfig.getScenarios().get(scenarioType.toLowerCase());
        if (rule == null)
            return 50;

        int score = rule.getBaseScore();
        if (rule.getConditions() != null) {
            for (RulesConfig.Condition condition : rule.getConditions()) {
                if (evaluateCondition(condition, answers)) {
                    score += condition.getBonus();
                }
            }
        }
        return Math.min(100, Math.max(0, score));
    }

    public int getEffort(String scenarioType) {
        RulesConfig.ScenarioRule rule = rulesConfig.getScenarios().get(scenarioType.toLowerCase());
        return rule != null ? rule.getEffort() : 50;
    }

    public int getRisk(String scenarioType) {
        RulesConfig.ScenarioRule rule = rulesConfig.getScenarios().get(scenarioType.toLowerCase());
        return rule != null ? rule.getRisk() : 50;
    }

    private boolean evaluateCondition(RulesConfig.Condition condition, Map<String, Object> answers) {
        Object answer = answers.get(condition.getField());
        if (answer == null)
            return false;

        if ("GT".equals(condition.getOperator())) {
            double val = Double.parseDouble(answer.toString());
            double target = Double.parseDouble(condition.getValue().toString());
            return val > target;
        }
        // Add more operators as needed
        return false;
    }
}
