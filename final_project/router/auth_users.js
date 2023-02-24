const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    const valid = users[username] == password
    return valid
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const user = req.body.username
    const pass = req.body.password
    if (!user && !pass) {
        return res.status(404).json({ message: "Missing credentials" })
    }

    if (authenticatedUser(user, pass)) {
        let accessToken = jwt.sign({
            data: pass,
        }, "access", { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, user
        }
        return res.status(200).json({ message: "User logged successfully" });
    } else {
        return res.status(208).json({ message: "Invalid login, check credentials" })
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const actualUser = req.session.authorization['user']
    let actualReview = req.query.review
    const book = req.params.isbn
    try{
        books[book]['reviews'][actualUser] = actualReview
        res.status(200).json({message:'Review added correctly.'})
    } catch(err){
        res.send({message: err.message, user:actualUser, review:actualReview, book:book})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const actualUser = req.session.authorization['user'];
    const book = req.params.isbn

    try {
        delete books[book]['reviews'][actualUser]
        res.status(200).json({message:`${actualUser} you review has been deleted.`})
    } catch(err){
        res.status(403).json({message:err.message})
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
