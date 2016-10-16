exports.render = (req, res) => {
    req.session.message = '';
    res.render('post', {
        name: req.session.name
    });
};
