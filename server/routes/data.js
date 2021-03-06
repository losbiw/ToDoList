const router = require('express').Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send(req.user);
});

router.post('/update', async(req, res) => {
    const { user, body } = req;
    const { googleID } = user;

    const updated = await User.findOneAndUpdate(
        { googleID }, 
        { tasks: body }
    );

    res.send(updated);
});

router.get('/logout', async(req, res) => {
    req.session = null;
    res.redirect('/');
});

module.exports = router