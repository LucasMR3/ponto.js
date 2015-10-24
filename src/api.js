'use strict';
var express = require('express'),
    app = express(),
    crawl = require('./crawler'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('./models').User,
    Record = require('./models').Record;


mongoose.connect(config.DB_ADDR);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/api/user', function(req, res) {
    User.findOne({
        mac_address: req.body.mac_address
    }, function(err, r) {
        if (r) {
            res.sendStatus(409);
        } else {
            var user = new User({
                nome: req.body.nome,
                mac_address: req.body.mac_address,
            });

            user.save(function(_err, _r) {
                if (!_err) {
                    res.send(_r);
                } else {
                    res.sendStatus(400);
                }
            });
        }
    });
});

app.get('/api/users', function(req, res) {
    User.find({}).populate('log_history').exec(function(err, ls) {
        if (err) {
            res.sendStatus(400);
        } else {
            res.send(ls);
        }
    });
});

app.get('/api/users/:mac_address', function(req, res) {
    User.find({
        mac_address: req.params.mac_address
    }).populate('log_history').exec(function(err, usr) {
        if (!usr) {
            res.sendStatus(404);
        } else {
            res.send(usr);
        }
    });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
});
