import { render } from '../node_modules/lit-html/lit-html.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

import { catalogView } from './views/catalog.js';
import { createView } from './views/create.js';
import { detailsView } from './views/details.js';
import { editView } from './views/edit.js';
import { loginView } from './views/login.js';
import { registerView } from './views/register.js';
import { profileView } from './views/profile.js';

import { logout } from './api/data.js';

const main = document.getElementById('site-content');

// Update navigation based on user authentication status
function updateNav() {
    const userEmail = sessionStorage.getItem('email');
    const guestDiv = document.getElementById('guest');
    const userDiv = document.getElementById('user');
    
    if (userEmail) {
        guestDiv.style.display = 'none';
        userDiv.style.display = 'block';
        userDiv.querySelector('span').textContent = `Welcome, ${userEmail}`;
    } else {
        guestDiv.style.display = 'block';
        userDiv.style.display = 'none';
    }
}

// Make updateNav available globally
window.updateNav = updateNav;

// Logout handler
async function onLogout() {
    try {
        await logout();
        updateNav();
        page.redirect('/catalog');
    } catch (error) {
        console.error('Logout error:', error);
        updateNav();
        page.redirect('/catalog');
    }
}

// Set up routes
page('/catalog', async () => {
    const view = await catalogView();
    render(view, main);
});

page('/login', () => {
    const view = loginView();
    render(view, main);
});

page('/register', () => {
    const view = registerView();
    render(view, main);
});

page('/create', () => {
    const view = createView();
    render(view, main);
});

page('/profile', async () => {
    const view = await profileView();
    render(view, main);
});

page('/details/:id', async (ctx) => {
    const view = await detailsView(ctx.params.id);
    render(view, main);
});

page('/edit/:id', async (ctx) => {
    const view = await editView(ctx.params.id);
    render(view, main);
});

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', onLogout);
    }
    
    // Initialize navigation and start routing
    updateNav();
    page.start();
    page.redirect('/catalog');
}