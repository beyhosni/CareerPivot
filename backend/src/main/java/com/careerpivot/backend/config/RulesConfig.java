package com.careerpivot.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "rules")
public class RulesConfig {
    private Map<String, ScenarioRule> scenarios;

    @Data
    public static class ScenarioRule {
        private int baseScore;
        private int effort;
        private int risk;
        private List<Condition> conditions;
    }

    @Data
    public static class Condition {
        private String field;
        private String operator;
        private Object value;
        private int bonus;
    }
}
