// OmniSearch static prototype logic.
// This file uses only mock conversation data and client-side filtering.

const mockConversations = [
  {
    source: "ChatGPT",
    title: "Q2 Launch Strategy Draft",
    date: "2026-04-18",
    matched: "launch messaging",
    snippet: "Framed hero narrative for launch week and outlined channel-by-channel rollout.",
    tags: ["marketing", "launch", "Q2"],
    relevance: 94,
    topics: ["Marketing", "Launch"]
  },
  {
    source: "Claude",
    title: "API Migration Risk Review",
    date: "2026-03-30",
    matched: "migration checklist",
    snippet: "Identified breaking changes, rollback plans, and dependency ownership map.",
    tags: ["engineering", "api", "risk"],
    relevance: 90,
    topics: ["Engineering", "Migration"]
  },
  {
    source: "Gemini",
    title: "Investor Deck Storyline",
    date: "2026-02-12",
    matched: "pitch deck",
    snippet: "Simplified traction story into a 10-slide narrative with clearer metrics.",
    tags: ["fundraising", "story", "deck"],
    relevance: 88,
    topics: ["Fundraising", "Narrative"]
  },
  {
    source: "Perplexity",
    title: "Competitor Scan: AI Assistants",
    date: "2026-01-09",
    matched: "competitor analysis",
    snippet: "Compared assistant pricing tiers and noted differentiation opportunities.",
    tags: ["research", "strategy"],
    relevance: 86,
    topics: ["Research", "Strategy"]
  },
  {
    source: "Copilot",
    title: "Refactor Notes for Search Module",
    date: "2026-05-01",
    matched: "search refactor",
    snippet: "Split parser and scorer into isolated utilities to improve maintainability.",
    tags: ["code", "refactor", "search"],
    relevance: 91,
    topics: ["Engineering", "Search"]
  },
  {
    source: "Grok",
    title: "Brand Voice Exploration",
    date: "2026-04-07",
    matched: "tone guidelines",
    snippet: "Tested bold vs minimal voice patterns across onboarding and retention copy.",
    tags: ["brand", "copywriting"],
    relevance: 84,
    topics: ["Brand", "Content"]
  }
];

const allSources = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot", "Grok"];
const allTopics = [...new Set(mockConversations.flatMap(item => item.topics))];

const state = { query: "", sources: new Set(allSources), topics: new Set(allTopics) };

const resultsNode = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const sourceFilters = document.getElementById("sourceFilters");
const topicFilters = document.getElementById("topicFilters");
const countNode = document.getElementById("resultsCount");

document.getElementById("clearBtn").addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  render();
});

searchInput.addEventListener("input", (e) => {
  state.query = e.target.value.trim().toLowerCase();
  render();
});

function createFilterButtons(container, values, setRef) {
  container.innerHTML = "";
  values.forEach(value => {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${setRef.has(value) ? "active" : ""}`;
    btn.textContent = value;
    btn.addEventListener("click", () => {
      if (setRef.has(value)) setRef.delete(value); else setRef.add(value);
      btn.classList.toggle("active", setRef.has(value));
      render();
    });
    container.appendChild(btn);
  });
}

function render() {
  const filtered = mockConversations
    .filter(item => state.sources.has(item.source))
    .filter(item => item.topics.some(topic => state.topics.has(topic)))
    .filter(item => {
      if (!state.query) return true;
      const blob = [item.title, item.matched, item.snippet, item.tags.join(" "), item.topics.join(" ")]
        .join(" ")
        .toLowerCase();
      return blob.includes(state.query);
    })
    .sort((a, b) => b.relevance - a.relevance);

  countNode.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
  resultsNode.innerHTML = filtered.map(item => `
    <article class="card">
      <div class="card-header">
        <span>${item.source}</span>
        <span>${item.date}</span>
      </div>
      <h3>${item.title}</h3>
      <p><strong>Matched:</strong> ${item.matched}</p>
      <p class="snippet">${item.snippet}</p>
      <div class="tag-row">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
      <p class="relevance">Relevance: ${item.relevance}</p>
      <button class="open-btn" type="button">Open original chat</button>
    </article>
  `).join("");
}

createFilterButtons(sourceFilters, allSources, state.sources);
createFilterButtons(topicFilters, allTopics, state.topics);
render();
