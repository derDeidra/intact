module.exports = function(app) {

    const landing = require('../controllers/landing.server.controller');
    const dashboard = require('../controllers/dashboard.server.controller');
    const auth = require('../controllers/auth.server.controller');
    const api = require('../controllers/api.server.controller');

    //Pages
    app.get('/', auth.indexRedirect, landing.render);
    app.get('/dashboard', auth.isLoggedIn, dashboard.render);

    //Auth
    app.post('/register', auth.register);
    app.post('/login', auth.login);
    app.post('/logout', auth.isLoggedIn, auth.logout);

};
