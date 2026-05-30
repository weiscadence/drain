const API_BASE = 'https://drainfun.xyz/api/search';
let currentCategory = 'all';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const categoryBtns = document.querySelectorAll('.cat-btn');

// Debounce helper
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Search function
async function search(query) {
  if (!query.trim()) {
    resultsDiv.innerHTML = '';
    return;
  }
  
  resultsDiv.innerHTML = '<div class="loading">🔍 Searching...</div>';
  
  try {
    const res = await fetch(`${API_BASE}?q=${encodeURIComponent(query)}&category=${currentCategory}`);
    const data = await res.json();
    
    if (data.success && data.results.length > 0) {
      renderResults(data.results);
    } else {
      resultsDiv.innerHTML = `<div class="no-results">No results for "${query}"</div>`;
    }
  } catch (err) {
    resultsDiv.innerHTML = '<div class="no-results">Search failed. Try again.</div>';
  }
}

// Render results
function renderResults(results) {
  resultsDiv.innerHTML = results.map(r => `
    <div class="result" data-link="${r.link}" data-external="${r.external || false}">
      <div>
        <span class="result-type ${r.type}">${r.type}</span>
        <span style="color:#666;font-size:11px">${r.url || r.source}</span>
      </div>
      <div class="result-title">${r.title} ${r.symbol || ''}</div>
      <div class="result-desc">${r.description}</div>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.result').forEach(el => {
    el.addEventListener('click', () => {
      const link = el.dataset.link;
      const external = el.dataset.external === 'true';
      
      if (external || link.startsWith('http')) {
        chrome.tabs.create({ url: link });
      } else {
        chrome.tabs.create({ url: `https://drainfun.xyz${link}` });
      }
    });
  });
}

// Category buttons
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    
    if (searchInput.value.trim()) {
      search(searchInput.value);
    }
  });
});

// Search on input (debounced)
const debouncedSearch = debounce(search, 300);
searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Search on button click
searchBtn.addEventListener('click', () => search(searchInput.value));

// Search on Enter
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search(searchInput.value);
  }
});

// Focus input on open
searchInput.focus();
