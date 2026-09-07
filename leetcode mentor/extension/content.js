/* ============================================================
   SHADOW DOM — All extension UI lives here, completely isolated
   from LeetCode's DOM, CSS, and JavaScript.
   LeetCode's React re-renders, style resets, or DOM mutations
   cannot affect anything inside this Shadow root.
   ============================================================ */

let shadow = null;

const MENTOR_STYLES = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* --- Side Panel --- */
#ai-dsa-panel {
    position: fixed;
    top: 15px;
    right: 15px;
    width: 420px;
    height: 92vh;
    border-radius: 12px;
    background: #282828;
    border: 1px solid #3e3e3e;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    overflow-y: auto;
    z-index: 2147483645;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #bfbfbf;
    font-size: 14px;
    line-height: 1.6;
    pointer-events: all;
}
#ai-dsa-panel h2 { margin-top:0; font-size:20px; font-weight:600; color:#eff2f6; }
#ai-dsa-panel h3 { margin-top:20px; font-size:16px; font-weight:600; color:#eff2f6; border-bottom:1px solid #3e3e3e; padding-bottom:6px; }
#ai-dsa-panel p { line-height:1.6; color:#bfbfbf; font-size:14px; }
.reveal-btn { width:100%; padding:10px; margin-top:12px; border:none; border-radius:6px; background:#333; color:#eff2f6; cursor:pointer; font-size:14px; font-weight:500; transition:background 0.2s ease; }
.reveal-btn:hover { background:#444; }
#close-ai-panel { background:none; border:none; font-size:20px; color:#bfbfbf; cursor:pointer; padding:4px; transition:color 0.2s ease; }
#close-ai-panel:hover { color:#eff2f6; }
hr { margin:18px 0; border:none; border-top:1px solid #3e3e3e; }
.panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.info-card { background:#333; border-radius:8px; padding:14px; margin:12px 0; border:1px solid #3e3e3e; transition:transform 0.2s ease, box-shadow 0.2s ease; }
.info-card:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
.info-title { font-size:14px; font-weight:600; color:#0a84ff; margin-bottom:8px; }
.badge { display:inline-block; padding:6px 12px; border-radius:20px; font-weight:600; color:white; font-size:12px; }
.badge.easy { background:#2cbb5d; } .badge.medium { background:#ffc01e; } .badge.hard { background:#ef4444; }
.score-box { text-align:center; padding:20px; margin-bottom:18px; background:#333; border-radius:8px; border:1px solid #3e3e3e; }
.score-number { font-size:42px; font-weight:700; color:#0a84ff; }
.section { margin-top:18px; }
.section-title { font-weight:600; margin-bottom:8px; color:#eff2f6; }
.recent-review { padding:12px; margin:10px 0; border-radius:8px; background:#333; border-left:4px solid #2cbb5d; }
.coach-card { margin:15px 0; padding:15px; border-radius:8px; border:1px solid #3e3e3e; background:#333; }
.coach-card h3 { margin-top:14px; margin-bottom:5px; color:#0a84ff; }
.coach-card p { margin:0; line-height:1.6; color:#bfbfbf; }
.dashboard-tabs { display:flex; gap:10px; margin:15px 0; flex-wrap:wrap; }
.tab { padding:8px 14px; cursor:pointer; border:none; border-radius:6px; background:#333; color:#bfbfbf; font-weight:500; transition:all 0.2s ease; font-family:inherit; }
.tab:hover { background:#444; }
.tab.active { background:#0a84ff; color:white; }
.weak-topic-card { background:#333; border:1px solid #3e3e3e; border-radius:8px; padding:14px; margin-bottom:12px; }
.weak-topic-card h3 { color:#ffc01e; margin-bottom:8px; }
.progress-card { background:#333; border:1px solid #3e3e3e; padding:15px; border-radius:8px; margin-bottom:15px; }
.score-card { background:#282828; padding:10px; margin-bottom:10px; border-radius:6px; }
.coach-section { margin-bottom:20px; }
.coach-section h3 { font-size:16px; margin-bottom:10px; color:#0a84ff; border-bottom:1px solid #3e3e3e; padding-bottom:5px; }
.split-card { display:flex; gap:15px; }
.split-card > div { flex:1; }
.coach-list { margin:0; padding-left:20px; color:#bfbfbf; }
.coach-list li { margin-bottom:5px; }
.goal-card { border-left:4px solid #2cbb5d; }
.plan-day { margin-bottom:10px; padding:10px; background:#282828; border-radius:6px; }
.plan-day strong { color:#ffc01e; }
.plan-day p { margin:5px 0 0 0; font-size:13px; color:#bfbfbf; }
.readiness-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:14px; color:#bfbfbf; }
.readiness-overall { font-size:16px; font-weight:bold; color:#a855f7; text-align:center; }
.motivation-card { font-style:italic; text-align:center; color:#2cbb5d; }
.progress-list { margin-top:20px; }
.progress-item { font-size:15px; color:#bfbfbf; margin-bottom:12px; display:flex; align-items:center; gap:8px; }

/* --- Single FAB Button --- */
#ai-mentor-fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #0a84ff, #6c47ff);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(10,132,255,0.45);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    pointer-events: all;
    letter-spacing: 0.3px;
}
#ai-mentor-fab:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 28px rgba(10,132,255,0.55); }
#ai-fab-icon { font-size: 18px; }

/* --- Popup Overlay --- */
#ai-mentor-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeInOverlay 0.18s ease;
    pointer-events: all;
}
@keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
#ai-mentor-popup {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 16px;
    padding: 28px 28px 24px;
    width: 420px;
    max-width: 94vw;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    animation: slideUpPopup 0.22s cubic-bezier(0.34,1.4,0.64,1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #eff2f6;
}
@keyframes slideUpPopup {
    from { opacity:0; transform:translateY(24px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
}
#ai-popup-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
#ai-popup-title { font-size:18px; font-weight:700; color:#eff2f6; }
#ai-popup-close { background:none; border:none; color:#888; font-size:16px; cursor:pointer; padding:4px 8px; border-radius:6px; transition:background 0.15s, color 0.15s; }
#ai-popup-close:hover { background:#2e2e2e; color:#ddd; }
#ai-popup-subtitle { font-size:13px; color:#777; margin:0 0 20px; }
#ai-popup-options { display:flex; flex-direction:column; gap:10px; }
.ai-popup-card {
    display:flex; align-items:center; gap:16px; width:100%;
    padding:16px 18px; background:#252525; border:1px solid #333;
    border-radius:12px; color:#eff2f6; cursor:pointer; text-align:left;
    transition:background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
    font-family:inherit;
}
.ai-popup-card:hover { background:#2c2c2c; transform:translateX(3px); }
.ai-popup-card-icon { font-size:26px; flex-shrink:0; width:36px; text-align:center; }
.ai-popup-card-text { display:flex; flex-direction:column; gap:3px; }
.ai-popup-card-text strong { font-size:14px; font-weight:600; color:#fff; }
.ai-popup-card-text span { font-size:12px; color:#888; line-height:1.4; }
#popup-analyze-btn:hover   { border-color:#0a84ff; }
#popup-review-btn:hover    { border-color:#2cbb5d; }
#popup-dashboard-btn:hover { border-color:#a855f7; }
#popup-analyze-btn:hover   .ai-popup-card-icon { filter:drop-shadow(0 0 6px #0a84ff88); }
#popup-review-btn:hover    .ai-popup-card-icon { filter:drop-shadow(0 0 6px #2cbb5d88); }
#popup-dashboard-btn:hover .ai-popup-card-icon { filter:drop-shadow(0 0 6px #a855f788); }
`;

function setupMentorRoot() {
    // If already set up, reuse the existing shadow root
    const existingHost = document.getElementById("ai-mentor-root");
    if (existingHost && existingHost.shadowRoot) {
        shadow = existingHost.shadowRoot;
        return;
    }
    // Create the host element — a neutral, zero-size, fixed container
    // that LeetCode's React will never touch because it's outside its root
    const host = document.createElement("div");
    host.id = "ai-mentor-root";
    host.style.cssText = "all:initial;position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:2147483647;";
    document.body.appendChild(host);
    // Attach shadow DOM — LeetCode's CSS cannot pierce this boundary
    shadow = host.attachShadow({ mode: "open" });
    // Inject all extension CSS into the shadow
    const styleEl = document.createElement("style");
    styleEl.textContent = MENTOR_STYLES;
    shadow.appendChild(styleEl);
}

/* ---- Data helpers (read from LeetCode page — intentional) ---- */
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

/* ---- UI helpers — all render inside Shadow DOM ---- */
function createPanel() {
    let panel = shadow.getElementById("ai-dsa-panel");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "ai-dsa-panel";
    shadow.appendChild(panel);
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
    shadow.getElementById("close-ai-panel").onclick = () => panel.remove();
    return shadow.getElementById("ai-panel-content");
}
function renderError(panelContent, message) {
    panelContent.innerHTML = `<p style="color:#ef4444;">❌ ${message}</p>`;
}
function attachToggle(buttonId, contentId) {
    const button = shadow.getElementById(buttonId);
    const content = shadow.getElementById(contentId);
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
            <span class="badge ${String(data.difficulty || "Unknown").toLowerCase()}">${data.difficulty ?? "Unknown"}</span>
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
                <p>${data.keyObservation || "Not available."}</p>
                ${renderReason(data.observationReason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="intuition-btn">🧠 Reveal Intuition</button>
            <div id="intuition-content" style="display:none;" class="info-card">
                <p>${data.intuition || "Not available."}</p>
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="hint1-btn">💡 Reveal Hint 1</button>
            <div id="hint1-content" style="display:none;" class="info-card">
                <p>${data.hint1 || "Not available."}</p>
                ${renderReason(data.hint1Reason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="hint2-btn">💡 Reveal Hint 2</button>
            <div id="hint2-content" style="display:none;" class="info-card">
                <p>${data.hint2 || "Not available."}</p>
                ${renderReason(data.hint2Reason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="mistakes-btn">⚠ Reveal Common Mistakes</button>
            <div id="mistakes-content" style="display:none;" class="info-card">
                <p>${Array.isArray(data.mistakesToAvoid) ? data.mistakesToAvoid.join("<br>") : (data.mistakesToAvoid || "Not available.")}</p>
                ${renderReason(data.mistakesReason)}
            </div>
        </div>
        <div class="section">
            <button class="reveal-btn" id="solution-btn">📝 Reveal Solution Idea</button>
            <div id="solution-content" style="display:none;" class="info-card">
                <p>${data.solutionExplanation || "Not available."}</p>
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
/* ============================================================
   INITIALIZATION — Boot the Shadow DOM then inject the FAB.
   No MutationObserver needed: Shadow DOM is immune to LeetCode's
   React re-renders. The host element lives outside React's tree.
   ============================================================ */
setupMentorRoot();

/* --- Popup Modal (renders inside Shadow DOM) --- */
function createMentorPopup() {
    if (shadow.getElementById("ai-mentor-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "ai-mentor-overlay";
    overlay.innerHTML = `
        <div id="ai-mentor-popup">
            <div id="ai-popup-header">
                <span id="ai-popup-title">🧠 AI DSA Mentor</span>
                <button id="ai-popup-close">✖</button>
            </div>
            <p id="ai-popup-subtitle">What would you like to do?</p>
            <div id="ai-popup-options">
                <button class="ai-popup-card" id="popup-analyze-btn">
                    <span class="ai-popup-card-icon">🧠</span>
                    <div class="ai-popup-card-text">
                        <strong>Analyze Problem</strong>
                        <span>Get hints, intuition &amp; pattern detection before you code</span>
                    </div>
                </button>
                <button class="ai-popup-card" id="popup-review-btn">
                    <span class="ai-popup-card-icon">🔍</span>
                    <div class="ai-popup-card-text">
                        <strong>Review My Code</strong>
                        <span>Score your solution on correctness, complexity &amp; interview-readiness</span>
                    </div>
                </button>
                <button class="ai-popup-card" id="popup-dashboard-btn">
                    <span class="ai-popup-card-icon">📊</span>
                    <div class="ai-popup-card-text">
                        <strong>Dashboard</strong>
                        <span>View your analytics, weak topics, AI coach &amp; progress</span>
                    </div>
                </button>
            </div>
        </div>
    `;
    // Append inside shadow — completely isolated from LeetCode's DOM
    shadow.appendChild(overlay);

    const closePopup = () => overlay.remove();

    // Click outside popup → close
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePopup();
    });
    shadow.getElementById("ai-popup-close").addEventListener("click", closePopup);
    shadow.getElementById("popup-analyze-btn").addEventListener("click", () => { closePopup(); runAnalyze(); });
    shadow.getElementById("popup-review-btn").addEventListener("click", () => { closePopup(); runReview(); });
    shadow.getElementById("popup-dashboard-btn").addEventListener("click", () => { closePopup(); runDashboard(); });
}

/* --- Single FAB Button (renders inside Shadow DOM) --- */
function insertFAB() {
    if (shadow.getElementById("ai-mentor-fab")) return;
    const fab = document.createElement("button");
    fab.id = "ai-mentor-fab";
    fab.innerHTML = `<span id="ai-fab-icon">🧠</span><span id="ai-fab-label">AI Mentor</span>`;
    fab.title = "Open AI DSA Mentor";
    fab.addEventListener("click", createMentorPopup);
    shadow.appendChild(fab);
}

insertFAB();

/* --- Feature Handlers --- */
async function runAnalyze() {
    const panel = createPanel();
    const panelContent = setupPanelHeader(panel, "🧠 AI DSA Mentor");
    try {
        const { title, statement, code } = getProblemContext();
        panelContent.innerHTML = renderAnalyzeProgress();
        const response = await fetch("http://localhost:3001/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, statement, code })
        });
        if (!response.ok) throw new Error("Server error");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let data = {};
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop();
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const chunk = JSON.parse(line);
                    if (chunk.type === "done") break;
                    // Update progress indicators inside Shadow DOM
                    if (chunk.type === "pattern")   shadow.getElementById("status-pattern").innerHTML   = "✅ Pattern Detected";
                    if (chunk.type === "intuition") shadow.getElementById("status-intuition").innerHTML = "✅ Understood Problem";
                    if (chunk.type === "hints")     shadow.getElementById("status-hints").innerHTML     = "✅ Generated Hints & Ideas";
                    if (chunk.data) Object.assign(data, chunk.data);
                } catch (e) {
                    console.error("Error parsing chunk", line, e);
                }
            }
        }
        panelContent.innerHTML = renderAnalyzeResults(data);
        attachToggle("observation-btn", "observation-content");
        attachToggle("intuition-btn",   "intuition-content");
        attachToggle("hint1-btn",       "hint1-content");
        attachToggle("hint2-btn",       "hint2-content");
        attachToggle("mistakes-btn",    "mistakes-content");
        attachToggle("solution-btn",    "solution-content");
    } catch (err) {
        renderError(panelContent, "Failed to analyze problem.");
        console.error(err);
    }
}

async function runReview() {
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
        const response = await fetch("http://localhost:3001/review", {
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
}

async function runDashboard() {
    const panel = createPanel();
    const panelContent = setupPanelHeader(panel, "📊 Dashboard");
    try {
        panelContent.innerHTML = `<p>Loading Dashboard...</p>`;
        const [analyticsRes, coachRes, learningRes] = await Promise.all([
            fetch("http://localhost:3001/analytics"),
            fetch("http://localhost:3001/coach"),
            fetch("http://localhost:3001/learning")
        ]);
        const data     = await analyticsRes.json();
        const coach    = await coachRes.json();
        const learning = await learningRes.json();
        panelContent.innerHTML = renderDashboardShell();
        // Query inside the panel (which is inside Shadow DOM)
        const tabContentArea = shadow.getElementById("dashboard-content-area");
        const tabs = panel.querySelectorAll(".tab");
        const renderTab = (section) => {
            if (section === "overview") tabContentArea.innerHTML = renderOverview(data);
            else if (section === "coach")    tabContentArea.innerHTML = renderCoach(coach);
            else if (section === "history")  tabContentArea.innerHTML = renderHistory(data);
            else if (section === "weak")     tabContentArea.innerHTML = renderWeakTopics(learning);
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
}