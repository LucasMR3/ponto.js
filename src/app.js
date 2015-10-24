'use strict';
var crawl = require('./crawler'),
    config = require('./config'),
    mongoose = require('mongoose'),
    User = require('./models').User,
    Record = require('./models').Record,
    config = require('./config');


mongoose.Promise = require('bluebird');
mongoose.connect(config.DB_ADDR);

console.log('...Running service...');

var loop = function() {
    console.log('...Listening for changes...');
    User.find({}).populate('log_history').exec(function(err, users) {
        if (err) {
            console.error(err);
        } else {
            crawl(config.ROUTER_IP, function(routerStatus) {
                for (var i = 0; i < users.length; i++) {
                    for (var j = 0; j < routerStatus.length; j++) {
                        if (users[i].mac_address === routerStatus[j].mac_address) {
                            (function(i, j, users, routerStatus) {
                                var record;
                                if (users[i].log_history.length < 1) {
                                    record = new Record({});
                                    record.save().then(function() {
                                        users[i].log_history.push(record._id);
                                        return users[i].save();
                                    }).then(function() {
                                        console.log('created first record for user: ', users[i].nome, ' --> ', new Date());
                                    });
                                } else {
                                    if (users[i].log_history[users[i].log_history.length - 1].isLogged !== routerStatus[j].isLogged) {
                                        record = new Record({
                                            isLogged: routerStatus[j].isLogged
                                        });
                                        record.save().then(function() {
                                            users[i].log_history.push(record._id);
                                            return users[i].save();
                                        }).then(function() {
                                            console.log('user ', users[i].nome, ' log status: ', routerStatus[j].isLogged);
                                        });
                                    }
                                }
                            })(i, j, users, routerStatus);
                        }
                    }
                }
            });
        }
    });
};

setInterval(function() {
    loop();
}, config.INTERVAL);
