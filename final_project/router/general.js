const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists." });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found for this author." });
    }

    return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title === title);

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found with this title." });
    }

    return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

// Route to get the book list
public_users.get('/async', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${BASE_URL}/:`, error.message);
        res.status(500).json({ message: 'Error retrieving book list' });
    }
});

// Route to get book details by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${BASE_URL}/isbn/${isbn}:`, error.message);
        res.status(500).json({ message: 'Error retrieving book details' });
    }
});

// Route to get book details by author
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${BASE_URL}/author/${author}:`, error.message);
        res.status(500).json({ message: 'Error retrieving books by author' });
    }
});

// Route to get book details by title
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${BASE_URL}/title/${title}:`, error.message);
        res.status(500).json({ message: 'Error retrieving books by title' });
    }
});