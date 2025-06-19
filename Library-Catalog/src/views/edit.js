import { html } from '../../node_modules/lit-html/lit-html.js';
import { getBookById, updateBook } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const editTemplate = (book, onSubmit) => html`
    <section id="edit-page" class="edit">
        <form id="edit-form" @submit=${onSubmit}>
            <fieldset>
                <legend>Edit my Book</legend>
                <p class="field">
                    <label for="title">Title</label>
                    <span class="input">
                        <input type="text" name="title" id="title" .value=${book.title}>
                    </span>
                </p>
                <p class="field">
                    <label for="description">Description</label>
                    <span class="input">
                        <textarea name="description" id="description">${book.description}</textarea>
                    </span>
                </p>
                <p class="field">
                    <label for="image">Image</label>
                    <span class="input">
                        <input type="text" name="imageUrl" id="image" .value=${book.imageUrl}>
                    </span>
                </p>
                <p class="field">
                    <label for="type">Type</label>
                    <span class="input">
                        <select id="type" name="type" .value=${book.type}>
                            <option value="Fiction" ?selected=${book.type === 'Fiction'}>Fiction</option>
                            <option value="Romance" ?selected=${book.type === 'Romance'}>Romance</option>
                            <option value="Mistery" ?selected=${book.type === 'Mistery'}>Mistery</option>
                            <option value="Classic" ?selected=${book.type === 'Classic'}>Classic</option>
                            <option value="Other" ?selected=${book.type === 'Other'}>Other</option>
                        </select>
                    </span>
                </p>
                <input class="button submit" type="submit" value="Save">
            </fieldset>
        </form>
    </section>
`;

export async function editView(id) {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        page.redirect('/login');
        return html`<div>Redirecting...</div>`;
    }
    
    try {
        const book = await getBookById(id);
        
        // Check if user is the owner
        if (book._ownerId !== userId) {
            page.redirect('/catalog');
            return html`<div>Redirecting...</div>`;
        }
        
        async function onSubmit(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            
            const title = formData.get('title');
            const description = formData.get('description');
            const imageUrl = formData.get('imageUrl');
            const type = formData.get('type');
            
            // Check for empty fields - this is important for the test
            if (!title || !description || !imageUrl || !type || 
                title.trim() === '' || description.trim() === '' || imageUrl.trim() === '') {
                alert('All fields are required!');
                return;
            }
            
            try {
                await updateBook(id, {
                    title: title.trim(),
                    description: description.trim(),
                    imageUrl: imageUrl.trim(),
                    type
                });
                page.redirect(`/details/${id}`);
            } catch (error) {
                alert(error.message);
            }
        }
        
        return editTemplate(book, onSubmit);
    } catch (error) {
        console.error('Error loading book for edit:', error);
        page.redirect('/catalog');
        return html`<div>Error loading book</div>`;
    }
}