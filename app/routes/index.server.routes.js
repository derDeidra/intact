module.exports = function(app) {

    const landing = require('../controllers/landing.server.controller');
    const register = require('../controllers/register.server.controller');
    const group = require('../controllers/group.server.controller');
    const creategroup = require('../controllers/creategroup.server.controller');
    const post = require('../controllers/post.server.controller');
    const createpost = require('../controllers/createpost.server.controller');
    const auth = require('../controllers/auth.server.controller');
    const api = require('../controllers/api.server.controller');
    const discover = require('../controllers/discover.server.controller');


    //Pages
    app.get('/', auth.indexRedirect, landing.render);
    app.get('/discover', auth.isLoggedIn, discover.render);
    app.get('/register', register.render);
    app.get('/g/:groupName/post', auth.isLoggedIn, createpost.render);
    app.get('/g/:groupName/edit', auth.isLoggedIn, creategroup.render);
    app.get('/createGroup', auth.isLoggedIn, creategroup.render);
    app.get('/g/:groupName', auth.isLoggedIn, group.render);
    app.get('/g/:groupName/p/:postId', auth.isLoggedIn, post.render);
    app.get('/g/:groupName/p/:postId/edit', auth.isLoggedIn, createpost.render);

    //Auth
    app.post('/register', auth.register);
    app.post('/login', auth.login);
    app.get('/logout', auth.isLoggedIn, auth.logout);

    //API
    app.post('/joinGroup', auth.isLoggedIn, api.joinGroup);
    app.post('/leaveGroup', auth.isLoggedIn, api.leaveGroup);


    app.post('/saveGroup', auth.isLoggedIn, api.saveGroup);
    app.post('/savePost', auth.isLoggedIn, api.savePost);
    app.post('/saveComment', auth.isLoggedIn, api.saveComment);

    app.post('/removeGroup', auth.isLoggedIn, api.removeGroup);
    app.post('/removePost', auth.isLoggedIn, api.removePost);
    app.post('/removeComment', auth.isLoggedIn, api.removeComment);

    app.get('/getUserId', auth.isLoggedIn, api.getUserId);
    app.get('/getUsers', auth.isLoggedIn, api.getUsers);
    app.get('/getUserGroups', auth.isLoggedIn, api.getUserGroups);
    app.get('/getAllGroups', auth.isLoggedIn, api.getAllGroups);
    app.get('/getPostsForGroup', auth.isLoggedIn, api.getPostsForGroup);
    app.get('/getPostDetails', auth.isLoggedIn, api.getPostDetails);
    app.get('/getGroupDetails', auth.isLoggedIn, api.getGroupDetails);
};
