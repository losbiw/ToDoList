const mongoose = require('mongoose');

const User = new mongoose.Schema({
    googleID: String,
    userName: String,
    photoURL: String,
    tasks: { type: mongoose.Schema.Types.Mixed, default: [{
        category: 'General',
        deletable: true,
        list: [
            { value: 'Your first task!' },
        ]
    }] }
})

module.exports = mongoose.model('Users', User);