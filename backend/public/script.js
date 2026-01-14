const API_URL = 'http://localhost:5000/api';
let currentToken = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));
let currentPageId = null;
let currentView = 'all'; // 'all', 'favorites', 'trash'



// Get DOM elements
const blocksContainer = document.getElementById('blocksContainer');
const addBlockBtn = document.getElementById('addBlockBtn');
const addPageBtn = document.getElementById('addPageBtn');
const pagesList = document.getElementById('pagesList');
const saveBtn = document.getElementById('saveBtn');
const pageTitle = document.getElementById('pageTitle');

// Load pages on startup
loadPages();

// Create a new block
function createBlock(content = '', blockId = null) {
    const block = document.createElement('div');
    block.className = 'block';
    block.dataset.blockId = blockId;
    block.innerHTML = `
        <div class="block-menu">⋮</div>
        <div class="block-delete" title="Delete block">🗑️</div>
        <textarea 
            class="block-content" 
            placeholder="Start writing or type '/' for commands"
            rows="1"
        >${content}</textarea>
    `;
    
    // Auto-resize textarea
    const textarea = block.querySelector('textarea');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    
    // Delete block functionality
    const deleteBtn = block.querySelector('.block-delete');
    deleteBtn.addEventListener('click', async () => {
        if (confirm('Delete this block?')) {
            const blockId = block.dataset.blockId;
            
            if (blockId && blockId !== 'null') {
                try {
                    await fetch(`${API_URL}/blocks/${blockId}`, {
                        method: 'DELETE',
                        headers: {
                            'x-auth-token': currentToken
                        }
                    });
                } catch (error) {
                    console.error('Error deleting block:', error);
                }
            }
            
            block.remove();
        }
    });
    
    return block;
}
// Load all pages from backend
async function loadPages() {
    try {
        let url = `${API_URL}/pages`;
        
        // Add filter based on current view
        if (currentView === 'favorites') {
            url += '?favorites=true';
        } else if (currentView === 'trash') {
            url += '?trash=true';
        }

        const response = await fetch(url, {
            headers: {
                'x-auth-token': currentToken
            }
        });

        const pages = await response.json();
        
        pagesList.innerHTML = '';
        
        if (pages.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = 'padding: 20px; text-align: center; color: #9ca3af; font-size: 14px;';
            emptyMsg.textContent = currentView === 'trash' ? 'Trash is empty' : 
                                   currentView === 'favorites' ? 'No favorites yet' : 
                                   'No pages yet';
            pagesList.appendChild(emptyMsg);
            return;
        }

        pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            pageItem.dataset.pageId = page._id;
            
            const favoriteIcon = page.isFavorite ? '⭐' : '';
            pageItem.innerHTML = `
                <span>${page.icon} ${page.title} ${favoriteIcon}</span>
                ${currentView === 'trash' ? 
                    `<button class="restore-btn" data-page-id="${page._id}" title="Restore">↩️</button>
                     <button class="delete-permanent-btn" data-page-id="${page._id}" title="Delete Forever">🗑️</button>` : 
                    `<button class="favorite-btn" data-page-id="${page._id}" title="Toggle Favorite">${page.isFavorite ? '⭐' : '☆'}</button>
                     <button class="trash-btn" data-page-id="${page._id}" title="Move to Trash">🗑️</button>`
                }
            `;
            
            // Click on page name to load
            pageItem.querySelector('span').addEventListener('click', () => {
                if (currentView !== 'trash') {
                    loadPage(page._id);
                }
            });
            
            pagesList.appendChild(pageItem);
        });

        // Add event listeners for action buttons
        addPageActionListeners();

        // Load first page if exists and not in trash view
        if (pages.length > 0 && currentView !== 'trash' && !currentPageId) {
            loadPage(pages[0]._id);
        }
    } catch (error) {
        console.error('Error loading pages:', error);
    }
}

// Add event listeners for page action buttons
function addPageActionListeners() {
    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const pageId = btn.dataset.pageId;
            try {
                await fetch(`${API_URL}/pages/${pageId}/favorite`, {
                    method: 'PATCH',
                    headers: {
                        'x-auth-token': currentToken
                    }
                });
                loadPages();
            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        });
    });

    // Trash buttons
    document.querySelectorAll('.trash-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Move this page to trash?')) {
                const pageId = btn.dataset.pageId;
                try {
                    await fetch(`${API_URL}/pages/${pageId}/trash`, {
                        method: 'PATCH',
                        headers: {
                            'x-auth-token': currentToken
                        }
                    });
                    if (currentPageId === pageId) {
                        currentPageId = null;
                        pageTitle.value = '';
                        blocksContainer.innerHTML = '';
                    }
                    loadPages();
                } catch (error) {
                    console.error('Error moving to trash:', error);
                }
            }
        });
    });

    // Restore buttons
    document.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const pageId = btn.dataset.pageId;
            try {
                await fetch(`${API_URL}/pages/${pageId}/restore`, {
                    method: 'PATCH',
                    headers: {
                        'x-auth-token': currentToken
                    }
                });
                loadPages();
            } catch (error) {
                console.error('Error restoring page:', error);
            }
        });
    });

    // Permanent delete buttons
    document.querySelectorAll('.delete-permanent-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Permanently delete this page? This cannot be undone!')) {
                const pageId = btn.dataset.pageId;
                try {
                    await fetch(`${API_URL}/pages/${pageId}/permanent`, {
                        method: 'DELETE',
                        headers: {
                            'x-auth-token': currentToken
                        }
                    });
                    loadPages();
                } catch (error) {
                    console.error('Error deleting page:', error);
                }
            }
        });
    });
}

// Load single page with blocks
async function loadPage(pageId) {
    try {
        currentPageId = pageId;

        // Get page details
        const pageResponse = await fetch(`${API_URL}/pages/${pageId}`, {
            headers: {
                'x-auth-token': currentToken
            }
        });
        const page = await pageResponse.json();
        pageTitle.value = page.title;

        // Get blocks for this page
        const blocksResponse = await fetch(`${API_URL}/blocks/${pageId}`, {
            headers: {
                'x-auth-token': currentToken
            }
        });
        const blocks = await blocksResponse.json();

        // Clear and render blocks
      // Clear and render blocks
          blocksContainer.innerHTML = '';
          blocks.forEach(block => {
          const blockEl = createBlock(block.content, block._id);
         blocksContainer.appendChild(blockEl);
    
    // Auto-resize textarea to show full content
    const textarea = blockEl.querySelector('textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
});

        // Highlight selected page
        document.querySelectorAll('.page-item').forEach(item => {
            item.style.background = '';
            item.style.color = '';
        });
        const selectedPage = document.querySelector(`[data-page-id="${pageId}"]`);
        if (selectedPage) {
            selectedPage.style.background = '#e0f2fe';
            selectedPage.style.color = '#0284c7';
        }
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Add new block on button click
addBlockBtn.addEventListener('click', async () => {
    if (!currentPageId) return;

    try {
        const response = await fetch(`${API_URL}/blocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': currentToken
            },
            body: JSON.stringify({
                pageId: currentPageId,
                content: '',
                order: blocksContainer.children.length
            })
        });

        const block = await response.json();
        const newBlock = createBlock(block.content, block._id);
        blocksContainer.appendChild(newBlock);
        newBlock.querySelector('.block-content').focus();
    } catch (error) {
        console.error('Error creating block:', error);
    }
});

// Auto-create new block when Enter is pressed
blocksContainer.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('block-content')) {
        e.preventDefault();
        addBlockBtn.click();
    }
    
    // Delete block on Backspace if empty
    if (e.key === 'Backspace' && e.target.classList.contains('block-content')) {
        if (e.target.value === '') {
            const currentBlock = e.target.closest('.block');
            const previousBlock = currentBlock.previousElementSibling;
            
            if (previousBlock && previousBlock.classList.contains('block')) {
                e.preventDefault();
                const blockId = currentBlock.dataset.blockId;
                
                // Delete from backend
                if (blockId && blockId !== 'null') {
                    try {
                        await fetch(`${API_URL}/blocks/${blockId}`, {
                            method: 'DELETE',
                            headers: {
                                'x-auth-token': currentToken
                            }
                        });
                    } catch (error) {
                        console.error('Error deleting block:', error);
                    }
                }
                
                const previousTextarea = previousBlock.querySelector('.block-content');
                currentBlock.remove();
                previousTextarea.focus();
                previousTextarea.setSelectionRange(previousTextarea.value.length, previousTextarea.value.length);
            }
        }
    }
});

// Add new page functionality
addPageBtn.addEventListener('click', async () => {
    const pageName = prompt('Enter page name:');
    if (pageName && pageName.trim() !== '') {
        try {
            const response = await fetch(`${API_URL}/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': currentToken
                },
                body: JSON.stringify({
                    title: pageName,
                    icon: '📄'
                })
            });

            const page = await response.json();
            loadPages();
            loadPage(page._id);
        } catch (error) {
            console.error('Error creating page:', error);
        }
    }
});

// Save all changes
saveBtn.addEventListener('click', async () => {
    if (!currentPageId) return;

    try {
        // Update page title
        await fetch(`${API_URL}/pages/${currentPageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': currentToken
            },
            body: JSON.stringify({
                title: pageTitle.value
            })
        });

        // Update all blocks
        const blocks = blocksContainer.querySelectorAll('.block');
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const blockId = block.dataset.blockId;
            const content = block.querySelector('.block-content').value;

            if (blockId && blockId !== 'null') {
                await fetch(`${API_URL}/blocks/${blockId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': currentToken
                    },
                    body: JSON.stringify({
                        content: content,
                        order: i
                    })
                });
            }
        }

        // Show success
        saveBtn.textContent = 'Saved ✓';
        saveBtn.style.background = '#10b981';

        setTimeout(() => {
            saveBtn.textContent = 'Save';
            saveBtn.style.background = '';
            loadPages();
        }, 2000);
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving changes!');
    }
});

// Logout functionality
document.querySelector('.workspace-name').addEventListener('dblclick', () => {
    if (confirm('Do you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
});

console.log('NotionLite connected to backend!');

// Auto-resize page title
pageTitle.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
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
        
        // Determine which view
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('all')) {
            currentView = 'all';
        } else if (text.includes('favorite')) {
            currentView = 'favorites';
        } else if (text.includes('trash')) {
            currentView = 'trash';
            currentPageId = null;
            pageTitle.value = '';
            blocksContainer.innerHTML = '';
        }
        
        // Reload pages with filter
        loadPages();
    });
});