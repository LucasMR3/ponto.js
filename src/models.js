'use strict';

var mongoose = require('mongoose');

var RecordSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    isLogged: {
        type: Boolean,
        default: true
    }
});

var UserSchema = mongoose.Schema({
    nome: String,
    mac_address: {
        type: String,
        unique: true
    },
    log_history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    }]
});

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Record = mongoose.model('Record', RecordSchema);
