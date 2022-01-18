const passport = require('passport');
const BnetStrategy = require('passport-bnet').Strategy;
const BNET_ID = process.env.BNET_OAUTH_CLIENT_ID;
const BNET_SECRET = process.env.BNET_OAUTH_CLIENT_SECRET;
const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || "http://localhost:3001/oauth/battlenet/callback";
const OAUTH_SCOPES = process.env.OAUTH_SCOPES || "wow.profile";
const REGION = process.env.REGION || "eu";

passport.use(
    new BnetStrategy(
        {
            clientID: BNET_ID,
            clientSecret: BNET_SECRET,
            scope: OAUTH_SCOPES,
            callbackURL: OAUTH_CALLBACK_URL,
            region: REGION
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});