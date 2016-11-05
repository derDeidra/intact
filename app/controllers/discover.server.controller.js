exports.render = (req, res) => {
    req.session.message = '';
    res.render('discover', {
        name: req.session.name
    });
};
