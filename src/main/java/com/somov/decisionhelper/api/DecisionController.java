package com.somov.decisionhelper.api;

import com.somov.decisionhelper.core.DecisionService;
import com.somov.decisionhelper.dto.EvaluateRequest;
import com.somov.decisionhelper.dto.EvaluateResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DecisionController {

    private final DecisionService service;

    public DecisionController(DecisionService service) {
        this.service = service;
    }

    @GetMapping("/ping")
    public String ping() {
        return "ok";
    }

    @PostMapping("/evaluate")
    public EvaluateResponse evaluate(@Valid @RequestBody EvaluateRequest request) {
        return service.evaluate(request);
    }
}