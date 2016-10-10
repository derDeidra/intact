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

    //API
    app.post('/saveGroup', auth.isLoggedIn, api.saveGroup);
    app.post('/savePost', auth.isLoggedIn, api.savePost);
    app.post('/saveComment', auth.isLoggedIn, api.saveComment);

    app.post('/removeGroup', auth.isLoggedIn, api.removeGroup);
    app.post('/removePost', auth.isLoggedIn, api.removePost);
    app.post('/removeComment', auth.isLoggedIn, api.removeComment);

    app.get('/getGroups', auth.isLoggedIn, api.getGroups);
};
