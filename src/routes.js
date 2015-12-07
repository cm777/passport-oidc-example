
export default (app, passport, controllers) => {
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login?sad=true')
  }

  app.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });

  app.get('/account', ensureAuthenticated, (req, res) => {
    res.render('account', { user: req.user });
  });

  app.get('/login', (req, res) => {
    res.render('login', { user: req.user });
  });

  app.get('/auth/oidc',
    passport.authenticate('openidconnect')
    // passport.authenticate('openidconnect', { scope: ['email', 'profile', 'openid'] })
    );

  app.get('/cb',
    passport.authenticate('openidconnect', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
