// Version Information
const VERSION = {
  name: "100 Souls Web Companion",
  version: "0.6.3.2",
  author: "Michael Hayeck",
  copyright: "100 Souls is © 2025 Michael Hayeck / Late Night LAN Party. All Rights Reserved. Non-commercial fan creations are welcome and allowed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).Commercial use of any part of 100 Souls requires prior written permission."
};

const RESOURCE_COLORS = {
  action: {
    active: 'bg-yellow-500 hover:bg-yellow-400',
    inactive: 'bg-gray-600'
  },
  reaction: {
    active: 'bg-orange-500 hover:bg-orange-400',
    inactive: 'bg-gray-600'
  },
  mana: {
    active: 'bg-blue-500 hover:bg-blue-400',
    inactive: 'bg-gray-600'
  },
  speed: {
    active: 'bg-emerald-500 hover:bg-emerald-400',
    inactive: 'bg-gray-600'
  }
};
const DEFAULT_CHARACTER = {
  "Character Info": [
    { "Name": "John Doe" },
    { "Epithat": "The Default Character" },
    { "Background": "Example Background." },
    { "Traits": "Example Traits." },
    { "Complications": "Example Complications" },
    { "Inventory": "Rusty sword, flask, medallion" },
    { "Notes": "Use this to write notes about your character, campaign, or whatever you want." }
  ],
  "Core Skills": [
    { "Physique": 2 },
    { "Coordination": 1 },
    { "Mental Resilience": 0 },
    { "Spiritual Aptitude": 1 }
  ],
  "Sensory Skills": [
    { "Spot": 0 },
    { "Listen": 0 },
    { "Smell": 0 },
    { "Taste": 0 },
    { "Touch": 0 }
  ],
  "Interpersonal Skills": [
    { "Etiquette": 0 },
    { "Streetwise": 0 },
    { "Perform": 0 },
    { "Empathy": 0 },
    { "Intimidate": 0 },
    { "Deceive": 0 },
    { "Persuade": 0 }
  ],
  "Knowledge Skills": [
    { "Arcana": 0 },
    { "Astronomy": 0 },
    { "Beast": 0 },
    { "Geography": 0 },
    { "History": 0 },
    { "Nature": 0 },
    { "Religion": 0 }
  ],
  "Practical Skills": [
    { "Administer": 0 },
    { "Beastbond": 0 },
    { "Craft": 0 },
    { "Tactics": 0 },
    { "Gaming": 0 },
    { "Logic": 0 },
    { "Medicine": 0 },
    { "Skullduggery": 0 },
    { "Survival": 0 }
  ],
  "Combat Stats": [
    { "Actions": 3 },
    { "Reactions": 3 },
    { "Mana": 0 },
    { "Speed": 3 },
    { "Melee Accuracy": 0 },
    { "Ranged Accuracy": 0 },
    { "Attack Damage": 0 },
    { "Ability Damage": 0 },
    { "Weapon Damage": 0 },
    { "Conduit Damage": 0 }
  ],
  "Damage Tracker": [
    { "Soft Health": 12 },
    { "Hard Health": 3 },
    { "Soft Damage": 0 },
    { "Hard Damage": 0 },
    { "Conditions": "" }
  ],
  "Dynamic_Data": [
    { 
      "Abilities": [],
      "Feats": []
    }
  ]
};

// Variables
let character = JSON.parse(localStorage.getItem("character")) || structuredClone(DEFAULT_CHARACTER);
let allAbilities = [];

// Export character and related functions
export { character, saveCharacterData };

// Import managers
import abilityManager from './abilityManager.js';
import featManager from './featManager.js';

// Data Management
function loadCharacterData() {
  // Load Character Info
  character["Character Info"].forEach(entry => {
    const key = Object.keys(entry)[0];
    const input = document.querySelector(`[data-section="Character Info"][data-key="${key}"]`);
    if (input) input.value = entry[key];
  });

  // Load Skills/Stats
  const skillSections = [
    "Core Skills", "Sensory Skills", "Interpersonal Skills", "Knowledge Skills",
    "Practical Skills", "Combat Stats", "Damage Tracker"
  ];

  skillSections.forEach(section => {
    const entries = character[section] || [];
    entries.forEach(entry => {
      const key = Object.keys(entry)[0];
      const input = document.querySelector(`[data-section="${section}"][data-key="${key}"]`);
      if (input) input.value = entry[key];
    });
  });
}
function saveCharacterData() {
  const updated = { "Character Info": [] };

  // Character Info - now looking for all inputs with data-section="Character Info"
  document.querySelectorAll('[data-section="Character Info"][data-key]').forEach(input => {
    updated["Character Info"].push({ [input.dataset.key]: input.value });
  });

  // Skills & Stats
  const skillSections = [
    "Core Skills", "Sensory Skills", "Interpersonal Skills", "Knowledge Skills",
    "Practical Skills", "Combat Stats", "Damage Tracker"
  ];

  skillSections.forEach(section => {
    updated[section] = [];
    const inputs = document.querySelectorAll(`[data-section="${section}"]`);
    inputs.forEach(input => {
      const key = input.dataset.key;
      const value = input.type === "number" ? parseInt(input.value) || 0 : input.value;
      updated[section].push({ [key]: value });
    });
  });

  // Preserve dynamic data (feats/abilities)
  updated["Dynamic_Data"] = character["Dynamic_Data"] || [];

  // Save to localStorage
  character = updated;
  localStorage.setItem("character", JSON.stringify(character));
  updateHealthDisplay(); // 🔄 Update bars on every save
}
function updateHealthDisplay() {
    // Get health and damage values from Damage Tracker section
    const softHealthInput = document.querySelector('[data-section="Damage Tracker"][data-key="Soft Health"]');
    const hardHealthInput = document.querySelector('[data-section="Damage Tracker"][data-key="Hard Health"]');
    const softDamageInput = document.querySelector('[data-section="Damage Tracker"][data-key="Soft Damage"]');
    const hardDamageInput = document.querySelector('[data-section="Damage Tracker"][data-key="Hard Damage"]');

    const softHealth = parseInt(softHealthInput?.value) || 0;
    const hardHealth = parseInt(hardHealthInput?.value) || 0;
    const softDamage = parseInt(softDamageInput?.value) || 0;
    const hardDamage = parseInt(hardDamageInput?.value) || 0;

    // Update text displays to show damage taken instead of remaining health
    const softCurrent = document.getElementById('soft-health-current');
    const softMax = document.getElementById('soft-health-max');
    const hardCurrent = document.getElementById('hard-health-current');
    const hardMax = document.getElementById('hard-health-max');

    if (softCurrent) softCurrent.textContent = softDamage;
    if (softMax) softMax.textContent = softHealth;
    if (hardCurrent) hardCurrent.textContent = hardDamage;
    if (hardMax) hardMax.textContent = hardHealth;

    // Create nodes for soft health
    const softNodesContainer = document.getElementById('soft-health-nodes');
    if (softNodesContainer) {
        softNodesContainer.innerHTML = '';
        for (let i = 0; i < softHealth; i++) {
            const node = document.createElement('div');
            node.className = `w-4 h-4 rounded-full ${i < softDamage ? 'bg-red-500' : 'bg-gray-600'}`;
            softNodesContainer.appendChild(node);
        }
    }

    // Create nodes for hard health
    const hardNodesContainer = document.getElementById('hard-health-nodes');
    if (hardNodesContainer) {
        hardNodesContainer.innerHTML = '';
        for (let i = 0; i < hardHealth; i++) {
            const node = document.createElement('div');
            node.className = `w-4 h-4 rounded-full ${i < hardDamage ? 'bg-red-600' : 'bg-gray-600'}`;
            hardNodesContainer.appendChild(node);
        }
    }
}
function setupAutoSaveListeners() {
    // Add event listeners to all inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        // Add input event listener for auto-save
        input.addEventListener('input', () => {
            saveCharacterData();
        });

        // Add event listener for resource nodes if it's a resource input
        if (input.dataset.section === "Combat Stats" && 
            ["Actions", "Reactions", "Mana", "Speed"].includes(input.dataset.key)) {
            input.addEventListener('input', () => {
                resetCombatResources();
            });
        }
    });
}
async function loadFeatsAndAbilities() {
  try {
    await featManager.loadFeats();
    await abilityManager.loadAbilities();
  } catch (err) {
    console.error("Failed to load feats and abilities:", err);
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Auto-save listeners
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      saveCharacterData();
      
      // Update resource nodes if it's a resource input
      if (input.dataset.section === "Combat Stats" && 
          ["Actions", "Reactions", "Mana", "Speed"].includes(input.dataset.key)) {
        resetCombatResources();
      }
    });
  });

  // Damage calculation listeners
  const damageInputs = [
    'Attack Damage',
    'Weapon Damage',
    'Ability Damage',
    'Conduit Damage',
    'Attack Power',
    'Ability Power'
  ];

  damageInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', calculateFinalDamages);
    }
  });

  // Dice roller
  const rollDiceBtn = document.getElementById("roll-dice-btn");
  if (rollDiceBtn) {
    rollDiceBtn.addEventListener("click", () => {
      const rollBtn = document.getElementById("roll-dice-btn");
      rollBtn.classList.add("btn-pop");
      setTimeout(() => rollBtn.classList.remove("btn-pop"), 150);

      const die1 = rollD6();
      const die2 = rollD6();
      let result = die1 - die2;

      const resultEl = document.getElementById("dice-result");
      const descEl = document.getElementById("dice-description");

      const formattedResult = result > 0 ? `+${result}` : `${result}`;
      const resultText = `${die1} - ${die2} = ${formattedResult}`;
      let flavor = "Normal Roll";
      let flavorColor = "text-gray-300";

      if (die1 === 6 && die2 === 6) {
        result = 6;
        resultText = "6 - 6 = +6";
        flavor = "🎉 Critical Success!";
        flavorColor = "text-green-400";
      } else if (die1 === 1 && die2 === 1) {
        result = -6;
        resultText = "1 - 1 = -6";
        flavor = "💥 Critical Failure!";
        flavorColor = "text-red-400";
      } else if (die1 === die2) {
        flavor = "♻️ Reroll Option!";
        flavorColor = "text-yellow-400";
      } else {
        if (result >= 4) {
          flavor = "👍 Great Roll!";
          flavorColor = "text-green-400";
        } else if (result > 0) {
          flavor = "👍 Good Roll.";
          flavorColor = "text-green-300";
        } else if (result <= -4) {
          flavor = "👎 Horrible Roll!";
          flavorColor = "text-red-400";
        } else if (result < 0) {
          flavor = "👎 Bad Roll.";
          flavorColor = "text-red-300";
        }
      }

      resultEl.textContent = resultText;
      resultEl.className = "text-2xl font-bold mb-2";
      if (result > 0) {
        resultEl.classList.add("text-green-400");
      } else if (result < 0) {
        resultEl.classList.add("text-red-400");
      } else {
        resultEl.classList.add("text-gray-300");
      }

      descEl.textContent = flavor;
      descEl.className = `text-sm font-semibold italic ${flavorColor} mb-4`;
    });
  }

  // Save/Load/Clear buttons
  document.getElementById("save-btn")?.addEventListener("click", () => {
    saveCharacterData();
    alert("Character saved!");
  });

  document.getElementById("load-btn")?.addEventListener("click", () => {
    location.reload();
  });

  document.getElementById("clear-btn")?.addEventListener("click", () => {
    localStorage.removeItem("character");
    location.reload();
  });

  // Import/Export
  document.getElementById("export-btn")?.addEventListener("click", () => {
    const dataStr = JSON.stringify(character, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "character.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("import-input")?.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        character = data;
        localStorage.setItem("character", JSON.stringify(character));
        location.reload();
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  });

  // Tab navigation
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('border-indigo-500', 'text-indigo-400');
        btn.classList.add('border-transparent', 'text-gray-500');
      });
      tabPanes.forEach(pane => {
        pane.classList.add('hidden');
        pane.classList.remove('active');
      });

      button.classList.remove('border-transparent', 'text-gray-500');
      button.classList.add('border-indigo-500', 'text-indigo-400');
      
      const tabId = button.getAttribute('data-tab');
      const pane = document.getElementById(`${tabId}-tab`);
      if (pane) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      }
    });
  });
}

// On Load
window.addEventListener("DOMContentLoaded", () => {
  // Display version information
  const versionInfo = document.getElementById('version-info');
  if (versionInfo) {
    versionInfo.innerHTML = `
      <div class="font-semibold">${VERSION.name}</div>
      <div class="text-xs text-gray-400">by ${VERSION.author}</div>
      <div class="text-xs text-gray-500">v${VERSION.version}</div>
    `;
  }

  // Display copyright information
  const copyrightInfo = document.getElementById('copyright-info');
  if (copyrightInfo) {
    copyrightInfo.textContent = VERSION.copyright;
  }

  // Load data and setup listeners
  loadCharacterData();
  setupEventListeners();
  updateHealthDisplay();
  loadFeatsAndAbilities();
  
  // Initialize combat resources
  resetCombatResources();
  
  // Calculate initial damages
  calculateFinalDamages();
});

// Combat Resources Management
function createResourceNode(resourceType, index) {
  const node = document.createElement('div');
  node.className = `w-6 h-6 rounded-full ${RESOURCE_COLORS[resourceType].active} cursor-pointer transition-colors duration-200`;
  node.dataset.index = index;
  node.dataset.used = 'false';
  node.addEventListener('click', () => toggleResourceNode(resourceType, node));
  return node;
}

function toggleResourceNode(resourceType, node) {
  const isUsed = node.dataset.used === 'true';
  node.dataset.used = isUsed ? 'false' : 'true';
  node.className = `w-6 h-6 rounded-full ${isUsed ? RESOURCE_COLORS[resourceType].active : RESOURCE_COLORS[resourceType].inactive} cursor-pointer transition-colors duration-200`;
}

window.resetResource = function(resourceType) {
  const container = document.getElementById(`${resourceType}Nodes`);
  const nodes = container.querySelectorAll('div');
  
  nodes.forEach(node => {
    node.dataset.used = 'false';
    node.className = `w-6 h-6 rounded-full ${RESOURCE_COLORS[resourceType].active} cursor-pointer transition-colors duration-200`;
  });
}

window.resetCombatResources = function() {
  // Get the base values from the character sheet
  const actions = parseInt(document.getElementById('Actions').value) || 0;
  const reactions = parseInt(document.getElementById('Reactions').value) || 0;
  const mana = parseInt(document.getElementById('Mana').value) || 0;
  const speed = parseInt(document.getElementById('Speed').value) || 0;

  // Reset each resource type
  resetResource('action');
  resetResource('reaction');
  resetResource('mana');
  resetResource('speed');

  // Update the number of nodes for each resource
  const actionNodes = document.getElementById('actionNodes');
  const reactionNodes = document.getElementById('reactionNodes');
  const manaNodes = document.getElementById('manaNodes');
  const speedNodes = document.getElementById('speedNodes');

  // Clear existing nodes
  actionNodes.innerHTML = '';
  reactionNodes.innerHTML = '';
  manaNodes.innerHTML = '';
  speedNodes.innerHTML = '';

  // Add new nodes
  for (let i = 0; i < actions; i++) {
    actionNodes.appendChild(createResourceNode('action', i));
  }
  for (let i = 0; i < reactions; i++) {
    reactionNodes.appendChild(createResourceNode('reaction', i));
  }
  for (let i = 0; i < mana; i++) {
    manaNodes.appendChild(createResourceNode('mana', i));
  }
  for (let i = 0; i < speed; i++) {
    speedNodes.appendChild(createResourceNode('speed', i));
  }
}

function calculateFinalDamages() {
  const attackDamage = parseInt(document.getElementById('Attack Damage')?.value) || 0;
  const weaponDamage = parseInt(document.getElementById('Weapon Damage')?.value) || 0;
  const abilityDamage = parseInt(document.getElementById('Ability Damage')?.value) || 0;
  const conduitDamage = parseInt(document.getElementById('Conduit Damage')?.value) || 0;
  const attackPower = parseInt(document.getElementById('Attack Power')?.value) || 100;
  const abilityPower = parseInt(document.getElementById('Ability Power')?.value) || 100;

  const finalAttackDamage = (attackDamage + weaponDamage) * (attackPower / 100);
  const finalAbilityDamage = (abilityDamage + conduitDamage) * (abilityPower / 100);

  document.getElementById('Final Attack Damage').textContent = finalAttackDamage.toFixed(1);
  document.getElementById('Final Ability Damage').textContent = finalAbilityDamage.toFixed(1);
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}