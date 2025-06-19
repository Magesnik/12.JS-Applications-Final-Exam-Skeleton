import { html } from '../../node_modules/lit-html/lit-html.js';
import { register } from '../api/data.js';
// Page.js се зарежда като script tag в HTML-а
const page = window.page;

const registerTemplate = (onSubmit) => html`
    <section id="register-page" class="register">
        <form id="register-form" @submit=${onSubmit}>
            <fieldset>
                <legend>Register Form</legend>
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
                <p class="field">
                    <label for="repeat-pass">Repeat Password</label>
                    <span class="input">
                        <input type="password" name="confirm-pass" id="repeat-pass" placeholder="Repeat Password">
                    </span>
                </p>
                <input class="button submit" type="submit" value="Register">
            </fieldset>
        </form>
    </section>
`;

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPass = formData.get('confirm-pass');
    
    // Check for empty fields - this is important for the test
    if (!email || !password || !confirmPass || email.trim() === '' || password.trim() === '' || confirmPass.trim() === '') {
        alert('All fields are required!');
        return;
    }
    
    if (password !== confirmPass) {
        alert('Passwords don\'t match!');
        return;
    }
    
    try {
        await register(email.trim(), password.trim());
        // Update navigation after successful registration
        window.updateNav();
        page.redirect('/catalog');
    } catch (error) {
        alert(error.message);
    }
}

export function registerView() {
    return registerTemplate(onSubmit);
}