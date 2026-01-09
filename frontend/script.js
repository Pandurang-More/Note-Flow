// Get DOM elements
const blocksContainer = document.getElementById('blocksContainer');
const addBlockBtn = document.getElementById('addBlockBtn');
const addPageBtn = document.getElementById('addPageBtn');
const pagesList = document.getElementById('pagesList');
const saveBtn = document.getElementById('saveBtn');

// Create a new block
function createBlock(content = '') {
    const block = document.createElement('div');
    block.className = 'block';
    block.innerHTML = `
        <div class="block-menu">⋮</div>
        <input 
            type="text" 
            class="block-content" 
            placeholder="Start writing or type '/' for commands"
            value="${content}"
        >
    `;
    return block;
}

// Add new block on button click
addBlockBtn.addEventListener('click', () => {
    const newBlock = createBlock();
    blocksContainer.appendChild(newBlock);
    newBlock.querySelector('.block-content').focus();
});

// Auto-create new block when Enter is pressed
blocksContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('block-content')) {
        e.preventDefault();
        const newBlock = createBlock();
        e.target.closest('.block').after(newBlock);
        newBlock.querySelector('.block-content').focus();
    }
    
    // Delete block on Backspace if empty
    if (e.key === 'Backspace' && e.target.classList.contains('block-content')) {
        if (e.target.value === '') {
            const currentBlock = e.target.closest('.block');
            const previousBlock = currentBlock.previousElementSibling;
            
            if (previousBlock && previousBlock.classList.contains('block')) {
                e.preventDefault();
                const previousInput = previousBlock.querySelector('.block-content');
                currentBlock.remove();
                previousInput.focus();
                // Move cursor to end
                previousInput.setSelectionRange(previousInput.value.length, previousInput.value.length);
            }
        }
    }
});

// Add new page functionality
addPageBtn.addEventListener('click', () => {
    const pageName = prompt('Enter page name:');
    if (pageName && pageName.trim() !== '') {
        const pageItem = document.createElement('div');
        pageItem.className = 'page-item';
        pageItem.setAttribute('data-page', pageName.toLowerCase().replace(/\s+/g, '-'));
        pageItem.innerHTML = `📄 ${pageName}`;
        pagesList.appendChild(pageItem);
    }
});

// Save button feedback
saveBtn.addEventListener('click', () => {
    // Get current page data
    const pageTitle = document.getElementById('pageTitle').value;
    const blocks = [];
    
    document.querySelectorAll('.block-content').forEach(block => {
        if (block.value.trim() !== '') {
            blocks.push(block.value);
        }
    });
    
    // Show save feedback
    saveBtn.textContent = 'Saved ✓';
    saveBtn.style.background = '#10b981';
    
    // Log data (in real app, this would send to backend)
    console.log('Saving page:', {
        title: pageTitle,
        blocks: blocks,
        timestamp: new Date().toISOString()
    });
    
    // Reset button after 2 seconds
    setTimeout(() => {
        saveBtn.textContent = 'Save';
        saveBtn.style.background = '';
    }, 2000);
});

// Page selection in sidebar
pagesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-item')) {
        // Remove active state from all pages
        document.querySelectorAll('.page-item').forEach(item => {
            item.style.background = '';
            item.style.color = '';
        });
        
        // Add active state to clicked page
        e.target.style.background = '#e0f2fe';
        e.target.style.color = '#0284c7';
        
        // In real app, this would load the page content
        console.log('Loading page:', e.target.getAttribute('data-page'));
    }
});

// Navigation items functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        console.log('Navigation clicked:', item.textContent.trim());
    });
});

// Auto-save functionality (optional)
let autoSaveTimer;
function autoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        console.log('Auto-saving...');
        // In real app, send data to backend
    }, 3000); // Auto-save after 3 seconds of inactivity
}

// Trigger auto-save on content change
document.getElementById('pageTitle').addEventListener('input', autoSave);
blocksContainer.addEventListener('input', autoSave);

// Welcome message
console.log('NotionLite loaded successfully!');
console.log('Ready to build the backend? Check console for save data.');