import { renderAbilityCard, renderAbilityList } from './abilities.js';
import { character, saveCharacterData } from './charactersheet.js';
import { baseUrl } from './config.js';

class AbilityManager {
  constructor() {
    this.abilities = {};
    this.container = document.getElementById('abilities-container');
    this.setupSearch();
  }

  setupSearch() {
    const searchInput = document.getElementById('ability-search-input');
    const dropdown = document.getElementById('ability-search-dropdown');

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

    const selectedAbilities = this.getSelectedAbilities();
    const matches = Object.entries(this.abilities)
      .filter(([id, ability]) => {
        const searchableText = [
          ability.name,
          ability.effect,
          ability.description,
          ...(ability.effects || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query) && !selectedAbilities.includes(id);
      });

    if (matches.length === 0) {
      dropdown.classList.add('hidden');
      return;
    }

    matches.forEach(([id, ability]) => {
      const option = document.createElement('div');
      option.className = 'p-2 hover:bg-indigo-600 hover:text-white cursor-pointer text-sm text-gray-200';
      option.textContent = ability.name;
      option.onclick = () => this.addAbility(id);
      dropdown.appendChild(option);
    });

    dropdown.classList.remove('hidden');
  }

  addAbility(abilityId) {
    if (!character.Dynamic_Data) {
      character.Dynamic_Data = [{ Abilities: [], Feats: [] }];
    }
    
    const abilities = character.Dynamic_Data[0].Abilities;
    if (!abilities.includes(abilityId)) {
      abilities.push(abilityId);
      saveCharacterData();
    }

    // Clear search
    const input = document.getElementById('ability-search-input');
    const dropdown = document.getElementById('ability-search-dropdown');
    if (input) input.value = '';
    if (dropdown) dropdown.classList.add('hidden');

    // Re-render abilities
    this.renderAbilities();
  }

  removeAbility(abilityId) {
    if (!character.Dynamic_Data) return;
    
    const abilities = character.Dynamic_Data[0].Abilities;
    const index = abilities.indexOf(abilityId);
    if (index !== -1) {
      abilities.splice(index, 1);
      saveCharacterData();
      this.renderAbilities();
    }
  }

  async loadAbilities() {
    try {
      const response = await fetch(`${baseUrl}/data/abilities.json`);
      this.abilities = await response.json();
      this.renderAbilities();
    } catch (error) {
      console.error('Error loading abilities:', error);
    }
  }

  getSelectedAbilities() {
    return character.Dynamic_Data?.[0]?.Abilities || [];
  }

  renderAbilities() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    const selectedAbilities = this.getSelectedAbilities();

    if (selectedAbilities.length === 0) {
      const noAbilities = document.createElement('div');
      noAbilities.className = 'col-span-full text-center py-8 text-gray-400';
      noAbilities.innerHTML = `
        <p class="text-lg mb-2">No abilities selected yet</p>
        <p class="text-sm">Use the search bar above to find and add abilities to your character.</p>
      `;
      this.container.appendChild(noAbilities);
      return;
    }

    // Get the full ability objects for the selected abilities
    const selectedAbilityObjects = selectedAbilities
      .map(abilityId => this.abilities[abilityId])
      .filter(ability => ability !== undefined);

    // Use the new renderAbilityList function to render grouped abilities
    renderAbilityList(selectedAbilityObjects);
  }
}

// Create and export a singleton instance
const abilityManager = new AbilityManager();
export default abilityManager; 