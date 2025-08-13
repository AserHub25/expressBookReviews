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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required"});
    }
    if (users.find( user => user.username === username)) {
        return res.status(409).json({ message: "User already exist"});
    }

    users.push({ username, password });
  return res.status(200).json({message: "Successful registration"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn =  req.params.isbn;
    
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase) {
            booksByAuthor.push(books[key]);
        }

    }

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No book found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];

    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    }
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No book found for that title"});
    }
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
