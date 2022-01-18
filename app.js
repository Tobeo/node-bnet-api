require('dotenv').config();

const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

require('./strategies/bnet');

const bnetRoutes = require('./routes/bnetRoutes')
const wowRoutes = require('./routes/wowRoutes')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors(
    {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    }
))
app.use(cookieParser());
app.use(session({
    secret: 'passport-battlenet-auth',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/oauth', bnetRoutes);
app.use('/wow', wowRoutes);

app.use(function (err, req, res, next) {
    console.error(err);
    res.send("<h1>Internal Server Error</h1>");
});

app.listen(PORT, function () {
    console.log('Listening on port %d', PORT);
});