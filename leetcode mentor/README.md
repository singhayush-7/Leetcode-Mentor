# 🧠 LeetCode Mentor: AI-Powered Socratic DSA Guide

![LeetCode Mentor](https://img.shields.io/badge/Status-Active-success) ![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue) ![Express](https://img.shields.io/badge/Express-5.x-lightgrey) ![Ollama](https://img.shields.io/badge/AI-Ollama-orange)

**LeetCode Mentor** is a privacy-first, fully local AI pair programmer built specifically for Data Structures and Algorithms (DSA). It injects directly into your LeetCode environment via a Chrome Extension and provides **Socratic mentoring**. 

Unlike ChatGPT or GitHub Copilot, which often spoil the answer by giving you the direct code, LeetCode Mentor acts like a Principal Software Engineer. It reads your current code, tracks your historical weaknesses, and provides targeted hints, intuition, and architecture feedback to guide you to the solution yourself.

---

## 🌟 Comprehensive Features

### 1. 🤖 Local Retrieval-Augmented Generation (RAG)
Your code never leaves your machine. By utilizing **Ollama**, the system runs Large Language Models locally. The RAG pipeline vectorizes your code (using `nomic-embed-text`), compares it against your past historical sessions using cosine similarity, and builds a massive context window so the AI knows exactly what patterns you struggle with.

### 2. 🛡️ Socratic, Anti-Spoil Mentoring
The system prompts are explicitly designed to *never* give you the direct solution. It provides:
- **Intuition:** "Why does a sliding window make sense here?"
- **Edge Cases:** "What happens if your array has only one element?"
- **Complexity Analysis:** "Your current approach is O(N^2). Can we use a hash map to bring it down to O(N)?"

### 3. 📊 Analytics & History Tracking
The backend utilizes `lowdb` (a lightweight JSON database) to keep a permanent record of every problem you solve. It tracks:
- **Algorithmic Patterns** (e.g., Two Pointers, BFS, DFS)
- **Scores & Relevancy** (How well you performed)
- **Time Complexity**
This allows the AI to say, *"You struggled with Two Pointers on your last 3 problems. Let's make sure we get it right this time."*

### 4. 🧩 Seamless UI Injection
A Manifest V3 Chrome Extension injects a custom, non-intrusive UI directly into `leetcode.com`. It automatically scrapes the DOM for the problem description and your active code editor contents, entirely removing the need to copy/paste between tabs.

---

## 🏗️ System Architecture

```text
[ User's Computer / Browser ]                        [ Local Node.js Backend Server ]
+-------------------------+                          +------------------------------------+
| Chrome Extension        |                          | Express.js API                     |
|                         |      HTTP POST           |                                    |
| +---------------------+ | <======================> |  +-------------+   +-------------+ |
| | LeetCode DOM (UI)   | |  JSON (Code, Context)    |  | Routes      |-->| Ollama API  | |
| | - Code Editor       | |                          |  +-------------+   | (Local LLM) | |
| | - Problem Text      | |                          |         |          +-------------+ |
| +---------------------+ |                          |         v                 |        |
|                         |                          |  +-------------+   +------v------+ |
| +---------------------+ |                          |  | lowdb       |   | Vector      | |
| | Injected Mentor UI  | |                          |  | (JSON)      |   | Service     | |
| +---------------------+ |                          |  +-------------+   +-------------+ |
+-------------------------+                          +------------------------------------+
```

### Request Flow
1. **Trigger:** User clicks "Get Hint" on the injected Chrome UI.
2. **Scrape:** `content.js` reads the DOM for current code and problem description.
3. **API Call:** Extension sends a POST request to `http://localhost:5000/analyze`.
4. **Vectorization:** Backend calls Ollama (`nomic-embed-text`) to generate embeddings for the current code.
5. **Retrieval:** `retrievalService.js` calculates cosine similarity against the `lowdb` database to find past relevant reviews.
6. **Prompt Assembly:** Backend stitches the code, problem text, and retrieved history into a specific system prompt.
7. **Inference:** Backend streams the prompt to Ollama (`qwen2.5:1.5b`).
8. **Response:** Socratic hints are formatted and sent back to the browser DOM.

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js:** v18.0 or higher.
- **Ollama:** Installed and running locally ([Download here](https://ollama.com/)).

#### Required Local AI Models
Open a terminal and pull the required models into Ollama:
```bash
ollama pull qwen2.5:1.5b
ollama pull nomic-embed-text
```

### 1. Starting the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary Node packages:
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Installing the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** using the toggle in the top right corner.
3. Click the **Load unpacked** button.
4. Select the `extension` folder from this repository.
5. Navigate to any LeetCode problem (e.g., `https://leetcode.com/problems/two-sum/`). The extension will automatically inject the Mentor UI.

---

## 🛠️ Technology Stack Deep Dive

### Frontend (Client)
- **Manifest V3:** Modern Chrome Extension architecture.
- **JavaScript (ES6):** Content scripts (`content.js`) for DOM manipulation.
- **Vanilla CSS:** Custom styling (`styles.css`) for the injected overlay.

### Backend (Server)
- **Node.js / Express:** High-performance, event-driven backend.
- **Cors:** Middleware to allow cross-origin requests from the Chrome Extension.
- **lowdb:** A lightweight, local JSON database perfect for single-user desktop applications without the overhead of PostgreSQL or MongoDB.

### AI & Machine Learning
- **Ollama:** A framework for running Large Language Models locally.
- **qwen2.5:1.5b:** A highly efficient, low-parameter model fine-tuned for coding and logic tasks, ensuring fast responses on consumer hardware.
- **nomic-embed-text:** A specialized embedding model used to convert text and code into mathematical vectors for similarity search.
- **Math:** Custom Cosine Similarity implementation (`vectorService.js`) to score historical relevancy.

---

## 🔌 API Endpoints Reference

The backend exposes several modular endpoints for the frontend to consume:

- `POST /analyze`: Analyzes the current code and problem description to provide Socratic hints.
- `POST /review`: Generates a final review of a submitted solution, scoring it on Time/Space complexity and assigning an algorithmic pattern.
- `GET /history`: Retrieves the user's past problem-solving history and scores from `lowdb`.
- `GET /analytics`: Aggregates historical data to provide insights into weakest/strongest algorithmic patterns.
- `POST /coach`: Engages in a conversational back-and-forth about specific logic blocks.
- `POST /learning`: Handles learning-focused prompt engineering for new topics.

---

## 📂 Project Structure

```text
leetcode-mentor/
├── backend/                  
│   ├── data/                 # Raw/Temp data
│   ├── database/             # lowdb initialization and JSON files
│   ├── prompts/              # Strict prompt engineering templates (hintPrompt, reviewPrompt, etc.)
│   ├── routes/               # Express API controllers
│   ├── services/             # Core Logic: RAG, Ollama interfacing, Embeddings, Analytics
│   ├── utils/                # JSON parsers and formatting helpers
│   ├── server.js             # Main Express server entry point
│   └── package.json          
├── extension/                
│   ├── content.js            # DOM Scraping & UI Injection
│   ├── styles.css            # Extension styling
│   └── manifest.json         # Chrome Extension metadata
└── README.md
```

---

## 🤝 Future Scope & Improvements
- **Migration to PostgreSQL/SQLite:** If scaling for multiple users, the `lowdb` JSON database will be swapped for a robust relational database.
- **Server-Sent Events (SSE) / WebSockets:** To stream the AI response character-by-character into the UI (similar to ChatGPT) rather than waiting for the full response payload.
- **Wider Model Support:** Creating an adapter layer to support OpenAI or Anthropic (Claude) APIs for users who prefer cloud models over local hardware.
