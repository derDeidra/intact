exports.render = (req, res) => {
    req.session.message = '';
    res.render('group', {
        name: req.session.name
    });
};