import abilityManager from './abilityManager.js';
import { character, saveCharacterData } from './charactersheet.js';

// Ability Card Rendering
function renderAbilityCard(ability) {
  const card = document.createElement('div');
  card.className = 'bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden hover:border-indigo-500 transition-colors duration-200';

  // Header
  card.innerHTML = `
    <div class="bg-gray-700/50 px-6 py-3 flex justify-between items-center border-b border-gray-600">
      <h3 class="text-xl font-bold text-gray-100">${ability.name}</h3>
      <div class="flex items-center gap-2">
        ${renderTags(ability)}
      </div>
    </div>
    
    <div class="space-y-1">
      ${renderCostSection(ability)}
      ${renderPropertiesSection(ability)}
      ${renderDebuffSection(ability)}
    </div>
  `;

  return card;
}

function renderTags(ability) {
  const tags = [];

  // Add tags if they exist
  if (ability.tags) {
    const tagColors = {
      'Strike': 'yellow',
      'Grapple': 'green',
      'Stance': 'green',
      'Movement': 'yellow',
      'Defense': 'orange'
    };

    // Handle both array and string formats
    const tagArray = Array.isArray(ability.tags) ? ability.tags : ability.tags.split(',').map(tag => tag.trim());
    
    tagArray.forEach(tag => {
      const color = tagColors[tag] || 'gray';
      tags.push(`<span class="px-3 py-1 bg-${color}-600/20 text-${color}-400 text-xs font-medium rounded-full border border-${color}-600/30">${tag}</span>`);
    });
  }

  // Add tempo if it exists
  if (ability.tempo) {
    const tempoColors = {
      'Quick': 'blue',
      'Balanced': 'orange',
      'Heavy': 'red'
    };
    const color = tempoColors[ability.tempo] || 'gray';
    tags.push(`<span class="px-3 py-1 bg-${color}-600/20 text-${color}-400 text-xs font-medium rounded-full border border-${color}-600/30">${ability.tempo}</span>`);
  }

  return tags.join('');
}

function renderCostSection(ability) {
  const costs = [];
  
  if (ability.action) {
    costs.push(`
      <div class="flex items-center gap-2">
        <span class="text-yellow-400 text-lg">⚡</span>
        <span class="text-sm text-gray-300">Action ${ability.action}</span>
      </div>
    `);
  }
  if (ability.reaction) {
    costs.push(`
      <div class="flex items-center gap-2">
        <span class="text-green-400 text-lg">↪</span>
        <span class="text-sm text-gray-300">Reaction ${ability.reaction}</span>
      </div>
    `);
  }
  if (ability.mana) {
    costs.push(`
      <div class="flex items-center gap-2">
        <span class="text-blue-400 text-lg">✧</span>
        <span class="text-sm text-gray-300">Mana ${ability.mana}</span>
      </div>
    `);
  }

  return costs.length ? `
    <div class="px-6 py-3 bg-gray-700/30 flex items-center gap-4 border-b border-gray-700">
      ${costs.join('')}
    </div>
  ` : '';
}

function renderPropertiesSection(ability) {
  let content = '';

  // Description
  if (ability.description !== undefined) {
    content += `
        <div class="px-6 py-3 border-b border-gray-700">
          <div class="flex items-start gap-3">
            <span class="text-gray-400 text-lg mt-1">📝</span>
            <div>
              <span class="text-gray-400 text-sm block mb-1">Description</span>
              <p class="text-gray-300 leading-relaxed">${ability.description}</p>
            </div>
          </div>
        </div>
      `;
  }

  // Requirement
  if (ability.requirement !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-yellow-400 text-lg mt-1">⚡</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Requirement</span>
            <span class="text-gray-300">${ability.requirement}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Power
  if (ability.power !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-orange-400 text-lg mt-1">⚔</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Power</span>
            <span class="text-gray-300 text-lg font-semibold">${ability.power}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Accuracy
  if (ability.accuracy !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-blue-400 text-lg mt-1">🎯</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Accuracy</span>
            <span class="text-gray-300 text-lg font-semibold">${ability.accuracy}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Duration
  if (ability.duration !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-gray-400 text-lg mt-1">⏱</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Duration</span>
            <span class="text-gray-300">${ability.duration}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Trigger
  if (ability.trigger !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-yellow-400 text-lg mt-1">⚡</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Trigger</span>
            <span class="text-gray-300">${ability.trigger}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Contest
  if (ability.contest !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-green-400 text-lg mt-1">⚔</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Contest</span>
            <span class="text-gray-300">${ability.contest}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Prediction
  if (ability.prediction !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-blue-400 text-lg mt-1">🔮</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Prediction</span>
            <span class="text-gray-300">${ability.prediction}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Success/Failure
  if (ability.success !== undefined || ability.failure !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        ${ability.success ? `
          <div class="flex items-start gap-3 mb-3">
            <span class="text-green-400 text-lg mt-1">✓</span>
            <div>
              <span class="text-gray-400 text-sm block mb-1">Success</span>
              <span class="text-gray-300">${ability.success}</span>
            </div>
          </div>
        ` : ''}
        ${ability.failure ? `
          <div class="flex items-start gap-3">
            <span class="text-red-400 text-lg mt-1">✗</span>
            <div>
              <span class="text-gray-400 text-sm block mb-1">Failure</span>
              <span class="text-gray-300">${ability.failure}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Single effect
  if (ability.effect !== undefined) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-purple-400 text-lg mt-1">✨</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Effect</span>
            <p class="text-gray-300 leading-relaxed">${ability.effect}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Multiple effects
  if (Array.isArray(ability.effects) && ability.effects.length > 0) {
    content += `
      <div class="px-6 py-3 border-b border-gray-700">
        <div class="flex items-start gap-3">
          <span class="text-purple-400 text-lg mt-1">✨</span>
          <div>
            <span class="text-gray-400 text-sm block mb-1">Effects</span>
            <ul class="text-gray-300 text-sm space-y-2 list-disc list-inside">
              ${ability.effects.map(effect => `<li class="leading-relaxed">${effect}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  return content;
}

function renderDebuffSection(ability) {
  if (!ability.debuff) return '';

  return `
    <div class="px-6 py-3 border-gray-700">
      <div class="flex items-start gap-3">
        <span class="text-gray-400 text-lg mt-1">⚠</span>
        <div>
          <span class="text-gray-400 text-sm block mb-1">Debuff</span>
          <p class="text-gray-300">${ability.debuff}</p>
        </div>
      </div>
    </div>
  `;
}

// Context Menu
function showContextMenu(e, ability) {
  // Remove any existing context menu
  const existingMenu = document.getElementById('ability-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  // Create new context menu
  const menu = document.createElement('div');
  menu.id = 'ability-context-menu';
  menu.className = 'fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50';

  // Position menu relative to the click, but ensure it stays within viewport
  const x = Math.min(e.clientX, window.innerWidth - 200); // Assuming menu width ~200px
  const y = Math.min(e.clientY, window.innerHeight - 50);  // Assuming menu height ~50px

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  // Add menu items
  const removeItem = document.createElement('div');
  removeItem.className = 'px-4 py-2 text-sm text-gray-300 hover:bg-red-700/50 cursor-pointer flex items-center gap-2';
  removeItem.innerHTML = '<span>×</span> Remove Ability';
  removeItem.onclick = () => {
    // Find the ability ID by searching through the abilities object
    const abilityId = Object.entries(abilityManager.abilities)
      .find(([id, a]) => a.name === ability.name)?.[0];

    if (abilityId) {
      abilityManager.removeAbility(abilityId);
    }
    menu.remove();
  };

  menu.appendChild(removeItem);
  document.body.appendChild(menu);

  // Close menu when clicking outside
  const closeMenu = (e) => {
    if (!menu.contains(e.target)) {
      menu.remove();
    }
  };
  document.addEventListener('click', closeMenu, { once: true });
}

// Ability Group Rendering
function renderAbilityGroup(groupId, abilities) {
  const groupData = getGroupData(groupId);
  const container = document.createElement('div');

  container.innerHTML = `
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-indigo-400 mb-2">${groupData.name}</h2>
      ${groupData.description ? `<p class="text-gray-400 italic">${groupData.description}</p>` : ''}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${Object.values(abilities)
      .filter(ability => ability.group === groupId)
      .map(ability => renderAbilityCard(ability).outerHTML)
      .join('')}
    </div>
  `;

  return container;
}

// Helper function to get group data
function getGroupData(groupId) {
  const groups = {
    fundamentals: {
      name: "Fundamentals",
      description: "A list of common actions available to most adventurers."
    },
    grappling_fundamentals: {
      name: "Grappling Fundamentals",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    west_god_style: {
      name: "West God - Fighting Style",
      description: "In initiative, lies the promise of victory."
    },
    south_god_style: {
      name: "South God - Fighting Style",
      description: "Evasion is the prelude to invincibility."
    }
  };

  return groups[groupId] || { name: groupId, description: "" };
}

function renderAbilityList(abilities) {
  const container = document.getElementById('abilities-container');
  if (!container) return;

  container.className = 'space-y-8';
  container.innerHTML = '';

  // Group abilities by their group property
  const groupedAbilities = {};
  abilities.forEach(ability => {
    const group = ability.group || 'Uncategorized';
    if (!groupedAbilities[group]) {
      groupedAbilities[group] = [];
    }
    groupedAbilities[group].push(ability);
  });

  // Create a section for each group
  Object.entries(groupedAbilities).forEach(([group, groupAbilities]) => {
    const section = document.createElement('div');
    section.className = 'bg-gray-900/50 rounded-lg p-6';
    section.dataset.group = group;

    section.innerHTML = `
      <div class="flex items-center justify-between mb-6 cursor-pointer group">
        <div>
          <h2 class="text-2xl font-bold text-gray-100">${getGroupData(group).name}</h2>
          <p class="text-gray-400 text-sm mt-1">${getGroupData(group).description}</p>
        </div>
        <span class="text-gray-400 text-xl transition-transform duration-200 group-hover:text-gray-300" id="${group}-icon">▼</span>
      </div>
      <div id="${group}-content" class="space-y-4" style="display: block;">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        </div>
      </div>
    `;

    const header = section.querySelector('.flex');
    header.addEventListener('click', () => toggleGroup(group));

    const grid = section.querySelector('.grid');
    grid.addEventListener('dragover', handleDragOver);
    grid.addEventListener('drop', handleDrop);

    // Add each ability card
    groupAbilities.forEach(ability => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'relative';
      cardWrapper.dataset.abilityName = ability.name;
      cardWrapper.draggable = true;

      cardWrapper.addEventListener('dragstart', handleDragStart);
      cardWrapper.addEventListener('dragend', handleDragEnd);
      cardWrapper.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, ability);
      });

      const dropIndicator = document.createElement('div');
      dropIndicator.className = 'absolute inset-0 border-2 border-dashed border-indigo-500 opacity-0 transition-opacity duration-200 pointer-events-none rounded-lg';
      cardWrapper.appendChild(dropIndicator);

      const card = renderAbilityCard(ability);
      cardWrapper.appendChild(card);

      grid.appendChild(cardWrapper);
    });

    container.appendChild(section);
  });
}

// Make toggleGroup available globally
window.toggleGroup = function (groupId) {
  const content = document.getElementById(`${groupId}-content`);
  const icon = document.getElementById(`${groupId}-icon`);

  if (content.style.display === 'none' || !content.style.display) {
    content.style.display = 'block';
    icon.style.transform = 'rotate(0deg)';
  } else {
    content.style.display = 'none';
    icon.style.transform = 'rotate(-90deg)';
  }
};

function getGroupDescription(group) {
  const descriptions = {
    'Fundamentals': 'Basic abilities that form the foundation of combat.',
    'West God': 'Divine abilities bestowed by the West God.',
    'East God': 'Divine abilities bestowed by the East God.',
    'North God': 'Divine abilities bestowed by the North God.',
    'South God': 'Divine abilities bestowed by the South God.',
    'Uncategorized': 'Abilities that don\'t belong to any specific group.'
  };
  return descriptions[group] || 'A collection of related abilities.';
}

// Drag and Drop Handlers
let draggedCard = null;
let lastDropIndicator = null;

function handleDragStart(e) {
  draggedCard = e.target;
  e.target.classList.add('opacity-50');
}

function handleDragEnd(e) {
  e.target.classList.remove('opacity-50');

  if (lastDropIndicator) {
    lastDropIndicator.style.opacity = '0';
    lastDropIndicator = null;
  }

  draggedCard = null;
}

function handleDragOver(e) {
  e.preventDefault();

  if (!draggedCard) return;

  const wrapper = e.target.closest('[data-ability-name]');
  if (!wrapper || wrapper.contains(draggedCard)) return;

  const dropIndicator = wrapper.querySelector('.border-dashed');

  if (lastDropIndicator && lastDropIndicator !== dropIndicator) {
    lastDropIndicator.style.opacity = '0';
  }

  if (dropIndicator) {
    dropIndicator.style.opacity = '1';
    lastDropIndicator = dropIndicator;
  }
}

function handleDrop(e) {
  e.preventDefault();

  if (!draggedCard) return;

  const dropGrid = e.target.closest('.grid');
  if (!dropGrid) return;

  const sourceGroup = draggedCard.closest('[data-group]').dataset.group;
  const targetGroup = dropGrid.closest('[data-group]').dataset.group;
  if (sourceGroup !== targetGroup) return;

  const abilities = character.Dynamic_Data[0].Abilities;

  const draggedId = Object.entries(abilityManager.abilities)
    .find(([id, a]) => a.name === draggedCard.dataset.abilityName)?.[0];

  if (!draggedId) return;
  const draggedIndex = abilities.indexOf(draggedId);
  if (draggedIndex === -1) return;

  const dropTarget = e.target.closest('[data-ability-name]');

  if (!dropTarget || dropTarget === draggedCard) {
    const id = abilities.splice(draggedIndex, 1)[0];
    abilities.push(id);
  } else {
    const targetId = Object.entries(abilityManager.abilities)
      .find(([id, a]) => a.name === dropTarget.dataset.abilityName)?.[0];

    if (!targetId) return;
    let targetIndex = abilities.indexOf(targetId);
    if (targetIndex === -1) return;

    const rect = dropTarget.getBoundingClientRect();
    const dropY = e.clientY;
    const threshold = rect.top + rect.height / 2;

    abilities.splice(draggedIndex, 1);

    let insertAt = targetIndex;
    if (dropY > threshold) {
      insertAt++;
    }
    if (draggedIndex < targetIndex) {
      // No need to adjust when removing first - the target index has already shifted
    } else {
      insertAt = dropY > threshold ? targetIndex + 1 : targetIndex;
    }

    abilities.splice(insertAt, 0, draggedId);
  }

  saveCharacterData();
  abilityManager.renderAbilities();
}

// Export functions
export {
  renderAbilityCard,
  renderAbilityList
}; 