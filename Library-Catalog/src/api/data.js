import * as api from './api.js';

const host = 'http://localhost:3030'
api.settings.host = 'http://localhost:3030';

// Authentication functions with correct field names for tests
export async function login(email, password) {
    // Send both email and username for compatibility
    const result = await api.post(host + '/users/login', { 
        email: email, 
        username: email, 
        password: password 
    });

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);
    return result;
}

export async function register(email, password) {
    // Send both email and username for compatibility
    const result = await api.post(host + '/users/register', { 
        email: email, 
        username: email, 
        password: password 
    });

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('authToken', result.accessToken);
    sessionStorage.setItem('userId', result._id);
    return result;
}

export async function logout() {
    const result = await api.get(host + '/users/logout');

    sessionStorage.removeItem('email');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    return result;
}

//Application-specific requests

export async function createBook(data) {
    return await api.post(host + '/data/books', data);
}

export async function getAllBooks() {
    return await api.get(host + '/data/books?sortBy=_createdOn%20desc');
}

export async function getBookById(id) {
    return await api.get(host + '/data/books/' + id);
}

export async function deleteBookById(id) {
    return await api.del(host + '/data/books/' + id);
}

export async function updateBook(id, data) {
    return await api.put(host + '/data/books/' + id, data);
}

export async function getUserBooks(userId) {
    return await api.get(host + `/data/books?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}

export async function getBookTotalLikes(bookId) {
    return await api.get(host + `/data/likes?where=bookId%3D%22${bookId}%22&distinct=_ownerId&count`);
}

export async function likeBookApi(bookId) {
    return await api.post(host + `/data/likes`, {bookId});
}

export async function isUserAlreadyLiked(bookId, userId) {
    return await api.get(host + `/data/likes?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`);
}