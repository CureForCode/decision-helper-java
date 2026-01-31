package com.somov.decisionhelper.core;

import com.somov.decisionhelper.dto.EvaluateRequest;
import com.somov.decisionhelper.dto.EvaluateResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DecisionService {

    public EvaluateResponse evaluate(EvaluateRequest req) {
        validateMatrixShape(req);

        var results = new ArrayList<EvaluateResponse.OptionResult>();

        for (int optionIdx = 0; optionIdx < req.getOptions().size(); optionIdx++) {
            String optionName = req.getOptions().get(optionIdx);

            double total = 0.0;
            List<EvaluateResponse.Contribution> breakdown = new ArrayList<>();

            for (int critIdx = 0; critIdx < req.getCriteria().size(); critIdx++) {
                var crit = req.getCriteria().get(critIdx);
                int weight = crit.getWeight();
                int score = req.getScores().get(optionIdx).get(critIdx);

                double weighted = score * (double) weight;
                total += weighted;

                breakdown.add(new EvaluateResponse.Contribution(
                        crit.getName(),
                        weight,
                        score,
                        weighted
                ));
            }

            results.add(new EvaluateResponse.OptionResult(optionName, round2(total), breakdown));
        }

        String winner = results.stream()
                .max(Comparator.comparingDouble(EvaluateResponse.OptionResult::getTotalScore))
                .map(EvaluateResponse.OptionResult::getOption)
                .orElse("N/A");

        return new EvaluateResponse(winner, results);
    }

    private void validateMatrixShape(EvaluateRequest req) {
        int options = req.getOptions().size();
        int criteria = req.getCriteria().size();

        if (req.getScores().size() != options) {
            throw new IllegalArgumentException("scores rows must match options size");
        }
        for (int i = 0; i < options; i++) {
            if (req.getScores().get(i).size() != criteria) {
                throw new IllegalArgumentException("each scores row must match criteria size");
            }
        }
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}