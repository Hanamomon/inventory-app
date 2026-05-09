const express = require('express');
const app = express();

const gamesRouter = require('./routes/gamesRouter');
const genresRouter = require('./routes/genresRouter');
const developersRouter = require('./routes/developersRouter');

const path = require('node:path');
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/games', gamesRouter);
app.use('/genres', genresRouter);
app.use('/developers', developersRouter);

app.listen(3000);