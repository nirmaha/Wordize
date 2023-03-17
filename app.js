const express = require('express');
const app = new express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const userName = encodeURIComponent('alive_tester_user');
const passWord = encodeURIComponent('QBgOSNMZWs@5');
mongoose.connect(`mongodb+srv://${userName}:${passWord}@cluster0.76v151b.mongodb.net/wordize`, {useNewUrlParser:true});
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
let successful = true;
let randomAmountOfLetters;
let randomAmountOfWordSpace;
let selectedLetters = [];
let wordCount = 0;
let user;

app.listen(3001);

/* Routing the pages to the server. */
app.get('/', (req, res) => {
    wordCount = 0;
    res.render('index');
});

app.get("/game", (req, res) => {
    // structure for rendering the game
    if (successful) {
        randomAmountOfLetters = Math.floor(Math.random() * 14) + 13;
        randomAmountOfWordSpace = Math.floor(Math.random() * 9) + 2;
        let letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        selectedLetters = [];
        let currentMax = 26;
        for (let i = 0; i < randomAmountOfLetters; i++) {
            let randomLetterIndex = Math.floor(Math.random() * currentMax);
            selectedLetters.push(letters[randomLetterIndex]);
            letters.splice(randomLetterIndex,1);
            currentMax--;
        }
        res.render('game', {
            randomAmountOfWordSpace,
            randomAmountOfLetters,
            selectedLetters,
            wordCount
        });
    }
    else {
        res.render('game', {
            randomAmountOfWordSpace,
            randomAmountOfLetters,
            selectedLetters,
            wordCount
        });
    }
});

app.post("/checker", (req, res) => {
    // process user input
    let letters = req.body;
    let words = "";
    for (const key in letters) {
        words += letters[key];
    }
    words = words.toLowerCase();
    let properLettersUsed = true;
    successful = true;
    for (let i = 0; i < words.length; i++) {
        let cur = words[i];
        for (let o = 0; o < selectedLetters.length; o++) {
            if (selectedLetters[o] === cur) {
                properLettersUsed = true;
                break;
            }
            else {
                properLettersUsed = false;
            }
        }
        if (!properLettersUsed) {
            successful = false;
            break;
        }
    }
    let dictionary;
    // Words provided by http://www.gwicks.net/dictionaries.htm
    fs.readFile('./client/possibleWords.txt', 'utf8', (err, data) => {
        if (err) throw err;
        dictionary = data.split('\n');
        let listCheck = true;
        for (let c = 0; c < dictionary.length; c++) {
            if (dictionary[c] === words) {
                listCheck = true;
                wordCount++;
                break;
            }
            else {
                listCheck = false;
            }
        }
        successful = listCheck;
        res.redirect("/game");
    });
});

app.post("/setup", (req, res) => {
    user = req.body.user;
    User.create({name: req.body.user, points: "Points: 0"}, () => {
        res.redirect("/");
    });
});

app.post("/scoring", (req, res) => {
    User.find({name: user}, (err, user) => {
        if (err) throw err;
        user.points = req.body.points;
        res.redirect("/game");
    });
});
