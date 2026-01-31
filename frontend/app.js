const API_URL = window.API_URL || "http://localhost:8080";
const el = (id) => document.getElementById(id);

const apiStatus = el("apiStatus");

const optionInput = el("optionInput");
const addOptionBtn = el("addOptionBtn");
const optionsList = el("optionsList");
const loadExampleBtn = el("loadExampleBtn");
const clearAllBtn = el("clearAllBtn");

const criterionInput = el("criterionInput");
const weightInput = el("weightInput");
const addCriterionBtn = el("addCriterionBtn");
const criteriaList = el("criteriaList");

const matrixWrap = el("matrixWrap");
const evaluateBtn = el("evaluateBtn");
const errorBox = el("errorBox");

const winnerEl = el("winner");
const resultsWrap = el("resultsWrap");
const whyWrap = el("whyWrap");

let options = [];
let criteria = [];
let scores = [];

function setStatus(text) {
    apiStatus.textContent = text;
}

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
}

function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[c]));
}

async function warmup() {
    const start = Date.now();
    setStatus("Warming up API…");
    evaluateBtn.disabled = true;

    for (let attempt = 1; attempt <= 15; attempt++) {
        try {
            const res = await fetch(`${API_URL}/api/ping`, { cache: "no-store" });
            if (!res.ok) throw new Error("ping failed");
            const ms = Date.now() - start;
            setStatus(`API is ready (${ms} ms)`);
            refreshEvaluateState();
            return;
        } catch {
            setStatus(`API is sleeping… retry ${attempt}/15`);
            await new Promise((r) => setTimeout(r, 900));
        }
    }

    setStatus("API unreachable. Check backend URL.");
}

function rebuildScores() {
    scores = options.map(() => criteria.map(() => 5));
}

function renderOptions() {
    optionsList.innerHTML = "";
    options.forEach((o, idx) => {
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `<div>${escapeHtml(o)}</div><button type="button">Remove</button>`;
        li.querySelector("button").addEventListener("click", () => {
            options.splice(idx, 1);
            rebuildScores();
            renderAll();
        });
        optionsList.appendChild(li);
    });
}

function renderCriteria() {
    criteriaList.innerHTML = "";
    criteria.forEach((c, idx) => {
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `<div>${escapeHtml(c.name)} <small>weight: ${c.weight}</small></div><button type="button">Remove</button>`;
        li.querySelector("button").addEventListener("click", () => {
            criteria.splice(idx, 1);
            rebuildScores();
            renderAll();
        });
        criteriaList.appendChild(li);
    });
}

function renderMatrix() {
    if (options.length < 2 || criteria.length < 1) {
        matrixWrap.innerHTML = `<div class="muted">Add at least 2 options and 1 criterion to build the matrix.</div>`;
        return;
    }

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");
    trh.innerHTML =
        `<th>Option</th>` +
        criteria.map(c => `<th>${escapeHtml(c.name)}<br><small class="muted">w=${c.weight}</small></th>`).join("");
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    options.forEach((opt, oi) => {
        const tr = document.createElement("tr");
        const cells = [`<td style="text-align:left">${escapeHtml(opt)}</td>`];

        criteria.forEach((_, ci) => {
            const val = scores[oi]?.[ci] ?? 5;
            cells.push(
                `<td><input type="number" min="1" max="10" value="${val}" data-oi="${oi}" data-ci="${ci}"/></td>`
            );
        });

        tr.innerHTML = cells.join("");
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    matrixWrap.innerHTML = "";
    matrixWrap.appendChild(table);

    matrixWrap.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", (e) => {
            const oi = Number(e.target.dataset.oi);
            const ci = Number(e.target.dataset.ci);

            let v = Number(e.target.value);
            if (!Number.isFinite(v)) v = 5;
            if (v < 1) v = 1;
            if (v > 10) v = 10;

            e.target.value = String(v);
            scores[oi][ci] = v;
        });
    });
}

function refreshEvaluateState() {
    const ready = apiStatus.textContent.startsWith("API is ready");
    evaluateBtn.disabled = !(ready && options.length >= 2 && criteria.length >= 1);
}

function renderAll() {
    renderOptions();
    renderCriteria();
    renderMatrix();
    refreshEvaluateState();
}

addOptionBtn.addEventListener("click", () => {
    clearError();
    const v = optionInput.value.trim();
    if (!v) return;
    if (options.length >= 8) return showError("Max 8 options.");
    options.push(v);
    optionInput.value = "";
    rebuildScores();
    renderAll();
});

addCriterionBtn.addEventListener("click", () => {
    clearError();

    const name = criterionInput.value.trim();
    const weight = parseInt(weightInput.value, 10);

    if (!name) return;
    if (criteria.length >= 8) return showError("Max 8 criteria.");
    if (!Number.isFinite(weight) || weight < 1 || weight > 5) {
        return showError("Weight must be 1..5.");
    }

    criteria.push({ name, weight });
    criterionInput.value = "";
    rebuildScores();
    renderAll();
    criterionInput.focus();
});

loadExampleBtn.addEventListener("click", () => {
    clearError();

    options = ["Move to Mannheim", "Move to Berlin", "Move to Hanover"];

    criteria = [
        { name: "Salary", weight: 5 },
        { name: "Weather", weight: 4 },
        { name: "Nature", weight: 4 },
        { name: "Food", weight: 5 },
    ];

    scores = [
        [10, 8, 8, 10],
        [9, 6, 5, 9],
        [8, 5, 5, 9],
    ];

    renderAll();
});

clearAllBtn.addEventListener("click", () => {
    clearError();
    options = [];
    criteria = [];
    scores = [];
    winnerEl.textContent = "—";
    resultsWrap.textContent = "—";
    whyWrap.textContent = "—";
    renderAll();
});

evaluateBtn.addEventListener("click", async () => {
    clearError();
    winnerEl.textContent = "Calculating…";
    resultsWrap.textContent = "";

    const payload = { options, criteria, scores };

    try {
        const res = await fetch(`${API_URL}/api/evaluate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            showError(data?.message || JSON.stringify(data));
            winnerEl.textContent = "—";
            resultsWrap.textContent = "—";
            whyWrap.textContent = "—";
            return;
        }

        winnerEl.innerHTML = `Winner: <strong>${escapeHtml(data.winner)}</strong>`;
        renderResults(data);
    } catch {
        showError("Network error. Check backend URL / CORS.");
        winnerEl.textContent = "—";
        resultsWrap.textContent = "—";
        whyWrap.textContent = "—";
    }
});

function renderResults(data) {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr><th style="text-align:left">Option</th><th>Total score</th></tr>
    </thead>
    <tbody>
      ${data.results.map(r => `
        <tr class="${r.option === data.winner ? "winner-row" : ""}">
          <td style="text-align:left">${escapeHtml(r.option)}</td>
          <td>${r.totalScore}</td>
        </tr>`).join("")}
    </tbody>
  `;

    resultsWrap.innerHTML = "";
    resultsWrap.classList.remove("muted");
    resultsWrap.appendChild(table);

    const html = data.results.map(r => {
        const items = r.breakdown.map(b =>
            `<li>${escapeHtml(b.criterion)}: score ${b.score} × w${b.weight} = <strong>${b.weighted}</strong></li>`
        ).join("");

        return `<div style="margin-top:10px">
      <div><strong>${escapeHtml(r.option)}</strong></div>
      <ul class="muted" style="margin:6px 0 0">${items}</ul>
    </div>`;
    }).join("");

    whyWrap.innerHTML = html || "—";
    whyWrap.classList.remove("muted");
}

(function init() {
    options = ["Move to Mannheim", "Move to Berlin"];
    criteria = [{ name: "Salary", weight: 5 }];
    rebuildScores();
    renderAll();
    warmup();
})();