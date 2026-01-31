package com.somov.decisionhelper.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateResponse {

    private String winner;
    private List<OptionResult> results;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionResult {
        private String option;
        private double totalScore;
        private List<Contribution> breakdown;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contribution {
        private String criterion;
        private int weight;
        private int score;
        private double weighted;
    }
}