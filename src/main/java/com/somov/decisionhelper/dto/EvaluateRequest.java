package com.somov.decisionhelper.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateRequest {

    @NotEmpty(message = "options must not be empty")
    @Size(max = 8, message = "options max size is 8")
    private List<@NotBlank @Size(max = 40) String> options;

    @NotEmpty(message = "criteria must not be empty")
    @Size(max = 8, message = "criteria max size is 8")
    @Valid
    private List<Criterion> criteria;

    /**
     * scores[optionIndex][criterionIndex] = 1..10
     */
    @NotEmpty(message = "scores must not be empty")
    private List<List<@NotNull @Min(1) @Max(10) Integer>> scores;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Criterion {
        @NotBlank
        @Size(max = 40)
        private String name;

        @NotNull
        @Min(1)
        @Max(5)
        private Integer weight;
    }
}