const express = require('express');
const app = new express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000);

/* Routing the pages to the server. */
app.get('/', (req, res) => {
    res.render('index');
});

app.get("/game", (req, res) => {
    res.render('game');
});
