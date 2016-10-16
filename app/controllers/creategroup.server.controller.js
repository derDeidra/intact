exports.render = (req, res) => {
    req.session.message = '';
    res.render('creategroup', {
        name: req.session.name
    });
};