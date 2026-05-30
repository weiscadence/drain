const API_BASE = 'https://drainfun.xyz/api/search';

// Handle omnibox input (when user types "agent [query]" in address bar)
chrome.omnibox.onInputEntered.addListener((text) => {
  const url = `https://drainfun.xyz/search?q=${encodeURIComponent(text)}`;
  chrome.tabs.update({ url });
});

// Provide suggestions as user types
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  if (text.length < 2) return;
  
  try {
    const res = await fetch(`${API_BASE}?action=suggest&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    
    if (data.success && data.suggestions) {
      const suggestions = data.suggestions.map(s => ({
        content: s,
        description: `Search for: <match>${s}</match>`
      }));
      suggest(suggestions);
    }
  } catch (err) {
    // Silently fail on suggestion errors
  }
});

// Set default suggestion
chrome.omnibox.setDefaultSuggestion({
  description: 'Search agents, tools, and platforms on AgentSearch'
});
