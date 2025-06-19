import { html } from '../../node_modules/lit-html/lit-html.js';
import { getUserBooks } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const profileTemplate = (books) => html`
    <section id="my-books-page" class="my-books">
        <h1>My Books</h1>
        ${books.length > 0 
            ? html`
                <ul class="my-books-list">
                    ${books.map(bookCard)}
                </ul>
            `
            : html`<p class="no-books">No books in database!</p>`
        }
    </section>
`;

const bookCard = (book) => html`
    <li class="otherBooks">
        <h3>${book.title}</h3>
        <p>Type: ${book.type}</p>
        <p class="img"><img src="${book.imageUrl}"></p>
        <a class="button" href="/details/${book._id}">Details</a>
    </li>
`;

export async function profileView() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        page.redirect('/login');
        return html`<div>Redirecting...</div>`;
    }
    
    try {
        const books = await getUserBooks(userId);
        return profileTemplate(books);
    } catch (error) {
        console.error('Error loading user books:', error);
        return profileTemplate([]);
    }
}