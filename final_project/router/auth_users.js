const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    if (!username || typeof username !== "string" || username.trim() === "") {
        return false;
    }

    let userExists = users.some((user) => user.username === username);
    return !userExists;
};

const authenticatedUser = (username, password)=>{
    return users.some(user => user.username === username && user.password === password);
}



//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid credentials" });
    }

    let accessToken = jwt.sign(
        { username },
        "secret_key",
        { 
            expiresIn: 60 * 60 
        }
    );
    req.session.authorization = { accessToken, username };
    
    return res.status(200).json({
        message: "Login successful",
        token: accessToken,
        username: username
    });
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const { review } = req.body;
    const isbn = req.params.isbn;

    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: " You must be logged in to post a review"});
    }

    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required"});
    }

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }


    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added and updated successfully", 
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
