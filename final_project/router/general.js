const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const user = req.body
    if(users[user.username]){
        res.send("The username it's alraedy used, please choose another")
        return
    }else {
        if(user.username && user.password){
            users[user.username] = user.password
            res.send(`The user ${user.username} has been created succesfully!`)
        } else {
            res.send("Missing credentials, please check the credentials provided")
        }        
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  res.send(JSON.stringify(book, null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const book = Object.values(books).filter(book => book.author === author)
    res.send(JSON.stringify(book, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const book = Object.values(books).filter(book => book.title == title)

  res.send(JSON.stringify(book, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn].reviews
  res.send(JSON.stringify(book, null, 4))
});

module.exports.general = public_users;
