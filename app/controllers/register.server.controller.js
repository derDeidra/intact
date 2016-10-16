exports.render = (req, res) => {
    req.session.message = '';
    res.render('register', {
        name: req.session.name
    });
};