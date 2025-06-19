import { html } from '../../node_modules/lit-html/lit-html.js';
import { createBook } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const createTemplate = (onSubmit) => html`
    <section id="create-page" class="create">
        <form id="create-form" @submit=${onSubmit}>
            <fieldset>
                <legend>Add new Book</legend>
                <p class="field">
                    <label for="title">Title</label>
                    <span class="input">
                        <input type="text" name="title" id="title" placeholder="Title">
                    </span>
                </p>
                <p class="field">
                    <label for="description">Description</label>
                    <span class="input">
                        <textarea name="description" id="description" placeholder="Description"></textarea>
                    </span>
                </p>
                <p class="field">
                    <label for="image">Image</label>
                    <span class="input">
                        <input type="text" name="imageUrl" id="image" placeholder="Image">
                    </span>
                </p>
                <p class="field">
                    <label for="type">Type</label>
                    <span class="input">
                        <select id="type" name="type">
                            <option value="Fiction">Fiction</option>
                            <option value="Romance">Romance</option>
                            <option value="Mistery">Mistery</option>
                            <option value="Classic">Classic</option>
                            <option value="Other">Other</option>
                        </select>
                    </span>
                </p>
                <input class="button submit" type="submit" value="Add Book">
            </fieldset>
        </form>
    </section>
`;

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
        await createBook({
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            type
        });
        page.redirect('/catalog');
    } catch (error) {
        alert(error.message);
    }
}

export function createView() {
    // Check if user is logged in
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        page.redirect('/login');
        return html`<div>Redirecting...</div>`;
    }
    
    return createTemplate(onSubmit);
}