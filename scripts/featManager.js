import { character, saveCharacterData } from './charactersheet.js';
import { baseUrl } from './config.js';

class FeatManager {
  constructor() {
    this.feats = [];
    this.container = document.getElementById('feats-container');
    this.setupSearch();
  }

  setupSearch() {
    const searchInput = document.getElementById('feat-search-input');
    const dropdown = document.getElementById('feat-search-dropdown');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      this.updateSearchDropdown(query, dropdown);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  updateSearchDropdown(query, dropdown) {
    dropdown.innerHTML = '';

    if (!query.trim()) {
      dropdown.classList.add('hidden');
      return;
    }

    const selectedFeats = this.getSelectedFeats();
    const matches = this.feats
      .map((feat, index) => ({ feat, index }))
      .filter(({ feat, index }) => {
        const searchableText = [
          feat.name,
          feat.description,
          feat.category,
          ...feat.synergy
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query) && !selectedFeats.includes(index);
      });

    if (matches.length === 0) {
      dropdown.classList.add('hidden');
      return;
    }

    matches.forEach(({ feat, index }) => {
      const option = document.createElement('div');
      option.className = 'p-2 hover:bg-indigo-600 hover:text-white cursor-pointer text-sm text-gray-200';
      option.textContent = feat.name;
      option.onclick = () => this.addFeat(index);
      dropdown.appendChild(option);
    });

    dropdown.classList.remove('hidden');
  }

  addFeat(featId) {
    if (!character.Dynamic_Data) {
      character.Dynamic_Data = [{ Abilities: [], Feats: [] }];
    }
    
    const feats = character.Dynamic_Data[0].Feats;
    if (!feats.includes(featId)) {
      feats.push(featId);
      saveCharacterData();
    }

    // Clear search
    const input = document.getElementById('feat-search-input');
    const dropdown = document.getElementById('feat-search-dropdown');
    if (input) input.value = '';
    if (dropdown) dropdown.classList.add('hidden');

    // Re-render feats
    this.renderFeats();
  }

  removeFeat(featId) {
    if (!character.Dynamic_Data) return;
    
    const feats = character.Dynamic_Data[0].Feats;
    const index = feats.indexOf(featId);
    if (index !== -1) {
      feats.splice(index, 1);
      saveCharacterData();
      this.renderFeats();
    }
  }

  async loadFeats() {
    try {
      const response = await fetch(`${baseUrl}/data/feats.json`);
      this.feats = await response.json();
      this.renderFeats();
    } catch (error) {
      console.error('Error loading feats:', error);
    }
  }

  getSelectedFeats() {
    return character.Dynamic_Data?.[0]?.Feats || [];
  }

  renderFeats() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    const selectedFeats = this.getSelectedFeats();

    if (selectedFeats.length === 0) {
      const noFeats = document.createElement('div');
      noFeats.className = 'col-span-full text-center py-8 text-gray-400';
      noFeats.innerHTML = `
        <p class="text-lg mb-2">No feats selected yet</p>
        <p class="text-sm">Use the search bar above to find and add feats to your character.</p>
      `;
      this.container.appendChild(noFeats);
      return;
    }

    selectedFeats.forEach(featId => {
      const feat = this.feats[featId];
      if (feat) {
        const card = this.createFeatCard(feat, featId);
        this.container.appendChild(card);
      }
    });
  }

  createFeatCard(feat, id) {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden';
    
    // Header
    card.innerHTML = `
      <div class="bg-gray-700 px-4 py-2 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-100">${feat.name}</h3>
        <div class="flex items-center gap-2">
          <span class="px-2 py-1 bg-indigo-600 text-xs rounded-full text-white">${feat.category}</span>
          ${feat.synergy.map(stat => `<span class="px-2 py-1 bg-green-600 text-xs rounded-full text-white">${stat}</span>`).join('')}
        </div>
      </div>
      
      <div class="p-4">
        <p class="text-gray-300">${feat.description}</p>
      </div>
    `;
    
    // Add context menu for removing feat
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showFeatContextMenu(e, id);
    });
    
    return card;
  }

  showFeatContextMenu(e, featId) {
    // Remove any existing context menu
    const existingMenu = document.getElementById('feat-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create new context menu
    const menu = document.createElement('div');
    menu.id = 'feat-context-menu';
    menu.className = 'fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50';
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;

    // Add menu items
    const removeItem = document.createElement('div');
    removeItem.className = 'px-4 py-2 text-sm text-gray-300 hover:bg-red-900/20 hover:text-red-400 cursor-pointer flex items-center gap-2';
    removeItem.innerHTML = '<span>×</span> Remove Feat';
    removeItem.onclick = () => {
      this.removeFeat(featId);
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
}

// Create and export a single instance
const featManager = new FeatManager();
export default featManager; 