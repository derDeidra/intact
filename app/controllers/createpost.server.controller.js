exports.render = (req, res) => {
    req.session.message = '';
    res.render('createpost', {
        name: req.session.name
    });
};