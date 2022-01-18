const axios = require('axios');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuth = require('../auth/ensureAuth');

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const REGION = process.env.REGION || 'eu';

router.get('/battlenet', passport.authenticate('bnet'));

router.get('/battlenet/callback',
        passport.authenticate('bnet', { failureRedirect: '/' }),
        (req, res) => {
                const token = req.user.token;
                res.cookie('bnetToken', token);
                res.redirect(CLIENT_ORIGIN);
        });

router.get('/getUserInfo',
        ensureAuth,
        (req, res) => {
                axios.get(`https://${REGION}.battle.net/oauth/userinfo`, {
                        headers: {
                                'Authorization': 'Bearer ' + req.user.token
                        }
                })
                        .then(response => {
                                res.send(response.data)
                        });
        });

router.get('/logout',
        (req, res) => {
                req.logout();
                res.clearCookie('bnetToken');
                res.redirect(CLIENT_ORIGIN);
        });

module.exports = router;