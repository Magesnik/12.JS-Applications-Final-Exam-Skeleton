import { html } from '../../node_modules/lit-html/lit-html.js';
import { getBookById, deleteBookById, getBookTotalLikes, isUserAlreadyLiked, likeBookApi } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const detailsTemplate = (book, onDelete, onLike, showEdit, showDelete, showLike, likes) => html`
    <section id="details-page" class="details">
        <div class="book-information">
            <h3>${book.title}</h3>
            <p class="type">Type: ${book.type}</p>
            <p class="img"><img src="${book.imageUrl}"></p>
            <div class="actions">
                ${showEdit ? html`<a class="button" href="/edit/${book._id}">Edit</a>` : ''}
                ${showDelete ? html`<a class="button" @click=${onDelete} href="javascript:void(0)">Delete</a>` : ''}
                ${showLike ? html`<a class="button" @click=${onLike} href="javascript:void(0)">Like</a>` : ''}
                <div class="likes">
                    <img class="hearts" src="/images/heart.png">
                    <span id="total-likes">Likes: ${likes}</span>
                </div>
            </div>
        </div>
        <div class="book-description">
            <h3>Description:</h3>
            <p>${book.description}</p>
        </div>
    </section>
`;

export async function detailsView(id) {
    try {
        const book = await getBookById(id);
        const userId = sessionStorage.getItem('userId');
        const isOwner = userId && book._ownerId === userId;
        const isLoggedIn = !!userId;
        
        let userLikedBook = 0;
        let totalLikes = 0;
        
        try {
            totalLikes = await getBookTotalLikes(id);
            if (isLoggedIn) {
                userLikedBook = await isUserAlreadyLiked(id, userId);
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
        
        const showEdit = isOwner;
        const showDelete = isOwner;
        const showLike = isLoggedIn && !isOwner && userLikedBook === 0;
        
        async function onDelete() {
            const confirmed = confirm('Are you sure you want to delete this book?');
            if (confirmed) {
                try {
                    await deleteBookById(id);
                    page.redirect('/catalog');
                } catch (error) {
                    alert(error.message);
                }
            }
        }
        
        async function onLike() {
            try {
                await likeBookApi(id);
                page.redirect(`/details/${id}`);
            } catch (error) {
                alert(error.message);
            }
        }
        
        return detailsTemplate(book, onDelete, onLike, showEdit, showDelete, showLike, totalLikes);
    } catch (error) {
        console.error('Error loading book details:', error);
        page.redirect('/catalog');
        return html`<div>Error loading book details</div>`;
    }
}