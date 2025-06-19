import { html } from '../../node_modules/lit-html/lit-html.js';
import { login } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const loginTemplate = (onSubmit) => html`
    <section id="login-page" class="login">
        <form id="login-form" @submit=${onSubmit}>
            <fieldset>
                <legend>Login Form</legend>
                <p class="field">
                    <label for="email">Email</label>
                    <span class="input">
                        <input type="text" name="email" id="email" placeholder="Email">
                    </span>
                </p>
                <p class="field">
                    <label for="password">Password</label>
                    <span class="input">
                        <input type="password" name="password" id="password" placeholder="Password">
                    </span>
                </p>
                <input class="button submit" type="submit" value="Login">
            </fieldset>
        </form>
    </section>
`;

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Check for empty fields - this is important for the test
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        alert('All fields are required!');
        return;
    }
    
    try {
        await login(email.trim(), password.trim());
        // Update navigation after successful login
        window.updateNav();
        page.redirect('/catalog');
    } catch (error) {
        alert(error.message);
    }
}

export function loginView() {
    return loginTemplate(onSubmit);
}