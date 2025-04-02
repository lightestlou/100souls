// Development mode check
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (!isDev) {
    alert('This page is only available in development mode.');
    window.location.href = '/';
}

// State management
let abilities = {};

// DOM Elements
const abilityList = document.getElementById('abilityList');
const abilityForm = document.getElementById('abilityForm');
const searchInput = document.getElementById('searchInput');
const addNewAbilityBtn = document.getElementById('addNewAbility');
const addFieldBtn = document.getElementById('addField');
const dynamicFieldsList = document.getElementById('dynamicFieldsList');

// Load abilities from JSON file
async function loadAbilities() {
    try {
        const response = await fetch('../data/abilities.json');
        abilities = await response.json();
        renderAbilityList();
    } catch (error) {
        console.error('Error loading abilities:', error);
        alert('Failed to load abilities. Make sure you\'re running this in development mode.');
    }
}

// Render the list of abilities
function renderAbilityList(filter = '') {
    abilityList.innerHTML = '';
    Object.entries(abilities)
        .filter(([id, ability]) => 
            id.toLowerCase().includes(filter.toLowerCase()) ||
            ability.name.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(([id, ability]) => {
            const div = document.createElement('div');
            div.className = 'list-group-item list-group-item-action';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${ability.name}</h6>
                        <small class="text-muted">${id}</small>
                    </div>
                    <span class="badge bg-primary">${ability.group}</span>
                </div>
            `;
            div.addEventListener('click', () => selectAbility(id));
            abilityList.appendChild(div);
        });
}

// Add a new dynamic field input
function addDynamicFieldInput(key = '', value = '') {
    const div = document.createElement('div');
    div.className = 'dynamic-field mb-2';
    div.innerHTML = `
        <div class="input-group mb-2">
            <input type="text" class="form-control" placeholder="Field name" value="${key}">
            <button class="btn btn-outline-danger" type="button" onclick="this.closest('.dynamic-field').remove()">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <textarea class="form-control" placeholder="Field value" rows="2">${value}</textarea>
    `;
    dynamicFieldsList.appendChild(div);
}

// Select an ability to edit
function selectAbility(id) {
    const ability = abilities[id];
    
    // Update core fields
    document.getElementById('abilityId').value = id;
    document.getElementById('abilityName').value = ability.name;
    document.getElementById('abilityGroup').value = ability.group;

    // Update tags field
    const tagsInput = document.getElementById('abilityTags');
    if (ability.tags) {
        if (Array.isArray(ability.tags)) {
            tagsInput.value = ability.tags.join(', ');
        } else {
            // If it's a string, split it by commas and clean it up
            tagsInput.value = ability.tags.split(',').map(tag => tag.trim()).join(', ');
        }
    } else {
        tagsInput.value = '';
    }

    // Update dynamic fields
    dynamicFieldsList.innerHTML = '';
    Object.entries(ability).forEach(([key, value]) => {
        // Skip core fields
        if (['id', 'name', 'group', 'tags'].includes(key)) return;
        
        // Handle array values
        if (Array.isArray(value)) {
            addDynamicFieldInput(key, value.join('\n'));
        } else {
            addDynamicFieldInput(key, value);
        }
    });
}

// Save ability changes
function saveAbility() {
    const formData = new FormData(abilityForm);
    
    // Build dynamic fields
    const dynamicFields = {};
    Array.from(dynamicFieldsList.children).forEach(field => {
        const keyInput = field.querySelector('input[placeholder="Field name"]');
        const valueInput = field.querySelector('textarea');
        if (keyInput.value) {
            const value = valueInput.value;
            // Handle array values (split by newlines)
            dynamicFields[keyInput.value] = value.includes('\n') ? value.split('\n') : value;
        }
    });

    // Build the complete ability object
    const ability = {
        name: formData.get('abilityName'),
        group: formData.get('abilityGroup')
    };

    // Add tags if they exist
    const tagsInput = formData.get('abilityTags');
    if (tagsInput) {
        ability.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Add dynamic fields
    Object.assign(ability, dynamicFields);

    // Remove undefined values
    Object.keys(ability).forEach(key => {
        if (ability[key] === undefined || ability[key] === '') {
            delete ability[key];
        }
    });

    // Show the ability JSON in a modal
    showJsonModal('Export Ability', 'Copy this ability JSON and update it in your abilities.json file:', ability);
}

// Show JSON in a modal
function showJsonModal(title, message, data) {
    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="jsonModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;">${JSON.stringify(data, null, 2)}</pre>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('jsonModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('jsonModal'));
    modal.show();
}

// Event Listeners
abilityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveAbility();
});

searchInput.addEventListener('input', (e) => {
    renderAbilityList(e.target.value);
});

addNewAbilityBtn.addEventListener('click', () => {
    abilityForm.reset();
    dynamicFieldsList.innerHTML = '';
});

addFieldBtn.addEventListener('click', () => {
    addDynamicFieldInput();
});

// Initialize
loadAbilities(); 