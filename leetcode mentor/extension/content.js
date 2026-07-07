function getCode() {
    const editors = document.querySelectorAll(".view-lines");
    let code = "";
    editors.forEach(editor => { code += editor.innerText + "\n"; });
    return code.trim();
}
function getProblemContext() {
    const pageText = document.body.innerText;
    const lines = pageText.split("\n");
    const title = lines.find(line => /^\d+\./.test(line));
    if (!title) throw new Error("Title not found");
    const start = pageText.indexOf(title);
    if (start === -1) throw new Error("Problem statement not found");
    const statement = pageText.slice(start, start + 4000);
    return { title, statement, code: getCode() };
}
function createPanel(title = "🧠 AI DSA Mentor") {
    let panel = document.getElementById("ai-dsa-panel");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "ai-dsa-panel";
    document.body.appendChild(panel);
    return panel;
}
function setupPanelHeader(panel, title = "🧠 AI DSA Mentor") {
    panel.innerHTML = `
        <div class="panel-header">
            <h2>${title}</h2>
            <button id="close-ai-panel">✖</button>
        </div>
        <div id="ai-panel-content"></div>
    `;
    document.getElementById("close-ai-panel").onclick = () => panel.remove();
    return document.getElementById("ai-panel-content");
}
function renderError(panelContent, message) {
    panelContent.innerHTML = `<p style="color: #ef4444;">❌ ${message}</p>`;
}
function attachToggle(buttonId, contentId) {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);
    if (!button || !content) return;
    const originalText = button.innerText;
    button.onclick = () => {
        if (content.style.display === "none") {
            content.style.display = "block";
            button.innerText = "🔽 Hide";
        } else {
            content.style.display = "none";
            button.innerText = originalText;
        }
    };
}
function renderAnalyzeProgress() {
    return `
        <div class="progress-list" style="margin-top:20px; font-size:15px; color:#ddd;">
            <div id="status-pattern" class="progress-item" style="margin-bottom:12px;">⏳ Detecting Pattern...</div>
            <div id="status-intuition" class="progress-item" style="margin-bottom:12px;">⏳ Understanding Problem...</div>
            <div id="status-hints" class="progress-item" style="margin-bottom:12px;">⏳ Generating Hints...</div>
        </div>
    `;
}
function renderAnalyzeResults(data) {
    const renderReason = (reason) => reason ? `<p style="font-size: 0.9em; font-style: italic; color: #aaa; margin-top: 5px;">Why: ${reason}</p>` : "";
    return `
        <div class="info-card">
            <div class="info-title">📌 Pattern</div>
            <p>${data.pattern ?? "Unknown"}</p>
            ${renderReason(data.patternReason)}
        </div>
        <div class="info-card">
            <div class="info-title">🎯 Difficulty</div>
            <span class="badge ${String(data.difficulty).toLowerCase()}">${data.difficulty ?? "Unknown"}</span>
        </div>
        <div class="info-card">
            <div class="info-title">⚡ Expected Complexity</div>
            <p>${data.expectedComplexity ?? "-"}</p>
            ${renderReason(data.complexityReason)}
        </div>
        <div class="info-card">
            <div class="info-title">📚 Prerequisites</div>
            <p>${Array.isArray(data.prerequisites) ? data.prerequisites.join("<br>") : "-"}</p>
        </div>
        <div class="section">
            <button class="reveal-btn" id="observation-btn">💡 Reveal Key Observation</button>
            <div id="observation-content" style="display:none;" class="info-card">
                <p>${data.keyObservation}</p>
                ${renderReason(data.observationReason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="intuition-btn">🧠 Reveal Intuition</button>
            <div id="intuition-content" style="display:none;" class="info-card">
                <p>${data.intuition}</p>
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="hint1-btn">💡 Reveal Hint 1</button>
            <div id="hint1-content" style="display:none;" class="info-card">
                <p>${data.hint1}</p>
                ${renderReason(data.hint1Reason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="hint2-btn">💡 Reveal Hint 2</button>
            <div id="hint2-content" style="display:none;" class="info-card">
                <p>${data.hint2}</p>
                ${renderReason(data.hint2Reason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="mistakes-btn">⚠ Reveal Common Mistakes</button>
            <div id="mistakes-content" style="display:none;" class="info-card">
                <p>${Array.isArray(data.mistakesToAvoid) ? data.mistakesToAvoid.join("<br>") : data.mistakesToAvoid}</p>
                ${renderReason(data.mistakesReason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="solution-btn">📝 Reveal Solution Idea</button>
            <div id="solution-content" style="display:none;" class="info-card">
                <p>${data.solutionExplanation}</p>
                ${renderReason(data.explanationReason)}
            </div>
        </div>
    `;
}
function renderReviewResults(review) {
    const renderReason = (reason) => reason ? `<p style="font-size: 0.9em; font-style: italic; color: #aaa; margin-top: 5px;">Why: ${reason}</p>` : "";
    return `
        <div class="score-box">
            <div class="info-title">Overall Score</div>
            <div class="score-number">${review.overallScore ?? "-"}</div>
        </div>
        <div class="info-card">
            <div class="info-title">🧩 Pattern Detected</div>
            <p>${review.pattern ?? "Unknown"}</p>
            ${renderReason(review.patternReason)}
        </div>
        <div class="info-card">
            <div class="info-title">✔ Correctness</div>
            <p>${review.correctness ?? "No comment."}</p>
            ${renderReason(review.correctnessReason)}
        </div>
        <div class="info-card">
            <div class="info-title">⏱ Complexity</div>
            <p><strong>Time:</strong> ${review.timeComplexity ?? "Unknown"}</p>
            ${renderReason(review.timeComplexityReason)}
            <p style="margin-top: 8px;"><strong>Space:</strong> ${review.spaceComplexity ?? "Unknown"}</p>
            ${renderReason(review.spaceComplexityReason)}
        </div>
        <div class="info-card">
            <div class="info-title">🚨 Issues</div>
            <p>${review.issues ?? (review.criticalIssues ?? "No issues identified.")}</p>
        </div>
        <div class="info-card">
            <div class="info-title">🚀 Optimization Suggestions</div>
            <p>${review.optimization ?? "No optimizations."}</p>
            ${renderReason(review.optimizationReason)}
        </div>
        <div class="info-card">
            <div class="info-title">🧠 Interviewer's Feedback</div>
            <p>${review.interviewerFeedback ?? "No feedback."}</p>
        </div>
        <div class="info-card">
            <div class="info-title">❓ Follow-up Interview Question</div>
            <p>${review.followUpQuestion ?? "No question."}</p>
        </div>
        <div class="info-card">
            <div class="info-title">📚 What Should You Learn Next?</div>
            <p>${review.nextLearning ?? "Not specified."}</p>
        </div>
        <div class="info-card">
            <div class="info-title">💯 Interview Readiness</div>
            <p><strong>${review.interviewReadiness ?? "-"}</strong></p>
        </div>
    `;
}
function renderDashboardShell() {
    return `
        <div class="dashboard-tabs">
            <button class="tab active" data-tab="overview">Overview</button>
            <button class="tab" data-tab="coach">AI Coach</button>
            <button class="tab" data-tab="history">History</button>
            <button class="tab" data-tab="weak">Weak Topics</button>
            <button class="tab" data-tab="progress">Progress</button>
        </div>
        <div id="dashboard-content-area"></div>
    `;
}
function renderOverview(data) {
    return `
        <h3>Total Problems</h3><p>${data.totalProblems}</p>
        <h3>Average Score</h3><p>${data.averageScore}</p>
        <h3>Strongest Pattern</h3><p>${data.strongestPattern}</p>
    `;
}
function renderCoach(coach) {
    return `
        <div class="coach-section">
            <h3>📈 Overall Assessment</h3>
            <div class="coach-card"><p>${coach.overallAssessment || coach.summary || "No assessment generated."}</p></div>
        </div>
        <div class="coach-section">
            <h3>💪 Strengths & ⚠ Weaknesses</h3>
            <div class="coach-card split-card">
                <div><strong>Strengths</strong><p>${coach.strengths || "No data."}</p></div>
                <div><strong>Weaknesses</strong><p>${coach.weaknesses || "No data."}</p></div>
            </div>
        </div>
        <div class="coach-section">
            <h3>📈 Trends & Mistakes</h3>
            <div class="coach-card split-card">
                <div>
                    <strong>Recent Trend</strong><p>${coach.improvementTrend || "Stable"}</p>
                    ${coach.trendReason ? `<p style="font-size: 0.85em; font-style: italic; color: #aaa;">Why: ${coach.trendReason}</p>` : ""}
                </div>
                <div>
                    <strong>Common Mistakes</strong>
                    <ul class="coach-list">${(coach.repeatedMistakes || []).map(m => `<li>${m}</li>`).join("") || "<li>None</li>"}</ul>
                </div>
            </div>
        </div>
        <div class="coach-section">
            <h3>🎯 Next Goal</h3>
            <div class="coach-card goal-card">
                <p>${coach.nextGoal || "Keep practicing!"}</p>
                ${coach.nextGoalReason ? `<p style="font-size: 0.85em; font-style: italic; color: #ccc;">Why: ${coach.nextGoalReason}</p>` : ""}
            </div>
        </div>
        <div class="coach-section">
            <h3>📚 5-Day Study Plan</h3>
            <div class="coach-card plan-card">
                ${(coach.studyPlan || []).map(day => `
                    <div class="plan-day">
                        <strong>${day.day || "-"}</strong>: ${day.topic || "-"}
                        <p>${day.objective || "-"}</p>
                    </div>
                `).join("")}
            </div>
        </div>
        <div class="coach-section">
            <h3>💡 Recommended Problems</h3>
            <div class="coach-card">
                <ul class="coach-list">${(coach.recommendedProblems || []).map(p => `<li>${p}</li>`).join("") || "<li>None</li>"}</ul>
            </div>
        </div>
        <div class="coach-section">
            <h3>🏆 Interview Readiness</h3>
            <div class="coach-card readiness-card">
                <div class="readiness-grid">
                    <div><strong>Problem Solving:</strong> ${coach.interviewReadiness?.problemSolving || "-"}</div>
                    <div><strong>Correctness:</strong> ${coach.interviewReadiness?.correctness || "-"}</div>
                    <div><strong>Optimization:</strong> ${coach.interviewReadiness?.optimization || "-"}</div>
                    <div><strong>Complexity:</strong> ${coach.interviewReadiness?.complexityAnalysis || "-"}</div>
                    <div><strong>Edge Cases:</strong> ${coach.interviewReadiness?.edgeCases || "-"}</div>
                    <div><strong>Communication:</strong> ${coach.interviewReadiness?.communication || "-"}</div>
                </div>
                <hr style="border-color: #444; margin: 10px 0;">
                <div class="readiness-overall"><strong>Overall:</strong> ${coach.interviewReadiness?.overall || "-"}</div>
            </div>
        </div>
        <div class="coach-section">
            <h3>🧠 Learning Insights</h3>
            <div class="coach-card">
                <ul class="coach-list">${(coach.learningInsights || []).map(i => `<li>${i}</li>`).join("") || "<li>None</li>"}</ul>
            </div>
        </div>
        <div class="coach-section">
            <h3>🔥 Motivation</h3>
            <div class="coach-card motivation-card">
                <p><em>"${coach.motivation || "Keep coding!"}"</em></p>
            </div>
        </div>
    `;
}
function renderHistory(data) {
    return `
        <h3>🕒 Recent Reviews</h3>
        ${(data.recentReviews || data.reviews || []).slice(0, 5).map(review => `
            <div class="recent-review">
                <strong>${review.title}</strong><br>
                ⭐ ${review.overallScore ?? review.score ?? 'N/A'}/10
            </div>
        `).join("")}
    `;
}
function renderWeakTopics(learning) {
    let html = `<h2>🎯 Learning Insights</h2><h3>Weak Patterns</h3>`;
    if (learning.weakPatterns.length) {
        html += learning.weakPatterns.map(item => `
            <div class="weak-topic-card">
                <h3>${item.pattern}</h3>
                <p>Average Score : ${item.averageScore.toFixed(1)}/10</p>
                <p style="font-size: 0.85em; font-style: italic; color: #aaa;">Why: Your average score is below the proficiency threshold (7.0).</p>
            </div>
        `).join("");
    } else {
        html += "<p>No learning data yet.</p>";
    }
    html += `<hr><h3>Repeated Mistakes</h3>`;
    if (learning.repeatedMistakes.length) {
        html += learning.repeatedMistakes.map(item => `
            <div class="weak-topic-card">${item[0]}<br>Seen ${item[1]} time(s)</div>
        `).join("");
    } else {
        html += "<p>No repeated mistakes found.</p>";
    }
    html += `<hr><h3>Recommendations</h3>`;
    if (learning.recommendations.length) {
        html += learning.recommendations.map(rec => `<div class="weak-topic-card">• ${rec}</div>`).join("");
    } else {
        html += "<p>No recommendations.</p>";
    }
    return html;
}
function renderProgress(learning) {
    const progress = learning.progress;
    return `
        <h2>📈 Progress Analytics</h2>
        <div class="progress-card">
            <p>Total Attempts: ${progress.totalAttempts}</p>
            <p>Trend: ${progress.improvementTrend}</p>
            <p>Best Streak: ${progress.bestStreak}</p>
        </div>
        <h3>Recent Scores</h3>
        ${progress.progress.slice(-10).map(item => `
            <div class="score-card">
                <strong>${item.title}</strong><br>Score: ${item.score}/10
            </div>
        `).join("")}
    `;
}
/* ------------------ Initialization ------------------ */
const analyzeButton = document.createElement("button");
analyzeButton.innerText = "🧠 Analyze";
analyzeButton.id = "ai-analyze-btn";
const reviewButton = document.createElement("button");
reviewButton.innerText = "🔍 Review";
reviewButton.id = "ai-review-btn";
const dashboardButton = document.createElement("button");
dashboardButton.innerText = "📊 Dashboard";
dashboardButton.id = "ai-dashboard-btn";
function insertButton() {
    const runButton = [...document.querySelectorAll("button")].find(btn => btn.innerText.trim() === "Run");
    if (!runButton) return;
    const parent = runButton.parentElement;
    if (document.getElementById("ai-analyze-btn")) return;
    parent.insertBefore(analyzeButton, runButton);
    parent.insertBefore(reviewButton, runButton);
    parent.insertBefore(dashboardButton, runButton);
}
let scheduled = false;
const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
        insertButton();
        scheduled = false;
    }, 300);
});
observer.observe(document.body, { childList: true, subtree: true });
insertButton();
analyzeButton.addEventListener("click", async () => {
    const panel = createPanel();
    const panelContent = setupPanelHeader(panel, "🧠 AI DSA Mentor");
    try {
        const { title, statement, code } = getProblemContext();
        panelContent.innerHTML = renderAnalyzeProgress();
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, statement, code })
        });
        if (!response.ok) throw new Error("Server error");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let data = {};
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let lines = buffer.split('\n');
            buffer = lines.pop();
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const chunk = JSON.parse(line);
                    if (chunk.type === "done") break;
                    if (chunk.type === "pattern") document.getElementById("status-pattern").innerHTML = "✅ Pattern Detected";
                    if (chunk.type === "intuition") document.getElementById("status-intuition").innerHTML = "✅ Understood Problem";
                    if (chunk.type === "hints") document.getElementById("status-hints").innerHTML = "✅ Generated Hints & Ideas";
                    if (chunk.data) Object.assign(data, chunk.data);
                } catch (e) {
                    console.error("Error parsing chunk", line, e);
                }
            }
        }
        panelContent.innerHTML = renderAnalyzeResults(data);
        attachToggle("observation-btn", "observation-content");
        attachToggle("intuition-btn", "intuition-content");
        attachToggle("hint1-btn", "hint1-content");
        attachToggle("hint2-btn", "hint2-content");
        attachToggle("mistakes-btn", "mistakes-content");
        attachToggle("solution-btn", "solution-content");
    } catch (err) {
        renderError(panelContent, "Failed to analyze problem.");
        console.error(err);
    }
});
reviewButton.addEventListener("click", async () => {
    const panel = createPanel();
    const panelContent = setupPanelHeader(panel, "🔍 AI Code Review");
    try {
        panelContent.innerHTML = `
            <p>📖 Reading your solution...</p>
            <p>🧠 Checking correctness...</p>
            <p>⚡ Looking for optimizations...</p>
            <p>🎯 Preparing interview feedback...</p>
        `;
        const { title, statement, code } = getProblemContext();
        const response = await fetch("http://localhost:5000/review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, statement, code })
        });
        if (!response.ok) throw new Error("Server Error");
        const review = await response.json();
        panelContent.innerHTML = renderReviewResults(review);
    } catch (err) {
        renderError(panelContent, "Unable to connect to backend.");
        console.error(err);
    }
});
dashboardButton.addEventListener("click", async () => {
    const panel = createPanel();
    const panelContent = setupPanelHeader(panel, "📊 Dashboard");
    try {
        panelContent.innerHTML = `<p>Loading Dashboard...</p>`;
        const [analyticsRes, coachRes, learningRes] = await Promise.all([
            fetch("http://localhost:5000/analytics"),
            fetch("http://localhost:5000/coach"),
            fetch("http://localhost:5000/learning")
        ]);
        const data = await analyticsRes.json();
        const coach = await coachRes.json();
        const learning = await learningRes.json();
        panelContent.innerHTML = renderDashboardShell();
        const tabContentArea = document.getElementById("dashboard-content-area");
        const tabs = panel.querySelectorAll(".tab");
        const renderTab = (section) => {
            if (section === "overview") tabContentArea.innerHTML = renderOverview(data);
            else if (section === "coach") tabContentArea.innerHTML = renderCoach(coach);
            else if (section === "history") tabContentArea.innerHTML = renderHistory(data);
            else if (section === "weak") tabContentArea.innerHTML = renderWeakTopics(learning);
            else if (section === "progress") tabContentArea.innerHTML = renderProgress(learning);
        };
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                renderTab(tab.dataset.tab);
            };
        });
        renderTab("overview");
    } catch (err) {
        renderError(panelContent, "Failed to load dashboard.");
        console.error(err);
    }
});