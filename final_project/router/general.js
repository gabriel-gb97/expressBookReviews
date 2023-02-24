const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const url = 'https://gabriel97312-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'


public_users.post("/register", (req, res) => {
    const user = req.body
    if (users[user.username]) {
        res.send("The username it's alraedy used, please choose another")
        return
    } else {
        if (user.username && user.password) {
            users[user.username] = user.password
            res.send(`The user ${user.username} has been created succesfully!`)
        } else {
            res.send("Missing credentials, please check the credentials provided")
        }
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn
    if (books[isbn]) {
        const book = books[isbn]
        res.status(200).send(JSON.stringify(book, null, 4))
    } else {
        res.status(404).send({message:`${isbn} its an invalid ISBN`})
    }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author
    const book = Object.values(books).filter(book => book.author === author)
    if(book.length > 0){
        res.send(JSON.stringify(book, null, 4))
    } else {
        res.status(404).send({message:`${author} has no matches.`})
    }
    
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title
    const book = Object.values(books).filter(book => book.title == title)
    if(book.length > 0){
        res.status(200).send(JSON.stringify(book, null, 4))
    } else {
        res.status(404).json(`${title} has no matches.`)
    }
    
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn].reviews
    res.send(JSON.stringify(book, null, 4))
});

module.exports.general = public_users;

//Task 10
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get(url)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(403).json({ message: err.message })
    }
});

//Task 11

public_users.get('/async/isbn/:isbn', async function (req, res) {
    const book = req.params.isbn
    try {
        const response = await axios.get(url + "/isbn/" + book)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(403).json({ message: err.message })
    }

});

//Task 12
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author
    try {
        const response = await axios.get(url + "/author/" + author)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(403).json({ message: err.message })
    }
});

//Task 13
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title
    try {
        const response = await axios.get(url + "/title/" + title)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(403).json({ message: err.message })
    }
});
