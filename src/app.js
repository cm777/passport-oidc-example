import express from 'express';
import util from 'util';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import engine from 'ejs-locals';
import passport from 'passport';
import Oidc from 'passport-openidconnect';
const OidcStrategy = Oidc.Strategy;
import routes from './routes';


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new OidcStrategy({
    callbackURL : 'http://localhost:3001/cb',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: 'openid profile email',

    authorizationURL : 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL : 'https://www.googleapis.com/oauth2/v4/token',
    userInfoURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    revocationURL: 'https://accounts.google.com/o/oauth2/revoke',
    tokenInfoURL: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
    oidcIssuer: 'accounts.google.com'
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    process.nextTick(function () {
      return done(null, { profile: profile });
    });
  }
));


let app = express();

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const controllers = {};

routes(app, passport, controllers);

const server = app.listen(3001, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
