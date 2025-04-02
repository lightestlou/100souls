let rules = [];

async function loadRules() {
  const res = await fetch("data/rules.json");
  rules = await res.json();
  renderCategories();
  renderRules();
}

const container = document.getElementById("rules-container");
const searchInput = document.getElementById("search-input");
const categoryNav = document.getElementById("category-nav");

function renderRules(filter = "", category = "") {
  container.innerHTML = "";
  const filtered = rules.filter(rule => {
    return (
      (!filter || rule.title.toLowerCase().includes(filter.toLowerCase()) || rule.content.toLowerCase().includes(filter.toLowerCase())) &&
      (!category || rule.category === category)
    );
  });

  filtered.forEach(rule => {
    const section = document.createElement("div");
    section.id = rule.id;
    section.innerHTML = `
      <h2 class="text-2xl font-bold text-yellow-300">${rule.title}</h2>
      <p class="text-gray-300">${rule.content}</p>
    `;
    container.appendChild(section);
  });
}

function renderCategories() {
  const categories = [...new Set(rules.map(r => r.category))];
  categoryNav.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "px-3 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-sm";
    btn.onclick = () => renderRules(searchInput.value, cat);
    categoryNav.appendChild(btn);
  });

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.className = "px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm";
  allBtn.onclick = () => renderRules(searchInput.value, "");
  categoryNav.prepend(allBtn);
}

searchInput.addEventListener("input", () => renderRules(searchInput.value));
loadRules();
