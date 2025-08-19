const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already taken"});
    }

    users.push({ username, password});
    return res.status(201).json({message: "User successfully registered"});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        if (books) resolve(JSON.stringify(books, null, 4));
        else reject("No books avalaible");
    }
).then(formattedBooks => res.send(formattedBooks))
.catch(err => res.status(500).json({ message: err }))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn =  req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        let booksByAuthor = [];
        for (let key in books) {
            if (books[key].author.toLowerCase() === author) booksByAuthor.push(books[key]);
        }
        if (booksByAuthor.length > 0) resolve(booksByAuthor);
        else reject("No book found");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(200).json({ message: err }));

    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        let booksByTitle = [];
        for (let key in books) {
            if (books[key].title.toLowerCase() === title) booksByTitle.push(books[keys]); 
        }

        if (booksByTitle.length > 0) resolve(booksByTitle); 
             else reject("No book found for that title");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        let reviews = books[isbn].reviews;

        if (reviews && Object.keys(reviews).length > 0) {
            return res.status(200).json(reviews);
        } else {
            return res.status(200).json({ message: "No reviews for this book yet"});
        }
    } else {
        return res.status(404).json({ message: "Book not found"});
    }

});

module.exports.general = public_users;