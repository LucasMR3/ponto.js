'use strict';
var request = require('request'),
    config = require('./config'),
    select = require('soupselect').select,
    htmlparser = require('htmlparser'),
    debug = function(cause) {
        console.log(cause);
    };

if (config.MOCK) {
    module.exports = function(r, cb) {
        cb([{
            mac_address: '78:31:c1:ba:99:82',
            isLogged: true
        }, {
            mac_address: '88:1f:a1:1e:b3:52',
            isLogged: false
        }, {
            mac_address: '4c:7c:5f:86:c4:f0',
            isLogged: false
        }, {
            mac_address: '00:1c:f0:ed:7f:0e',
            isLogged: false
        }, {
            mac_address: '30:b5:c2:11:95:31',
            isLogged: false
        }, {
            mac_address: '34:a3:95:ce:51:69',
            isLogged: false
        }, {
            mac_address: '48:d7:05:4c:af:07',
            isLogged: false
        }, {
            mac_address: '5c:51:4f:bd:6f:14',
            isLogged: false
        }, {
            mac_address: '28:5a:eb:c5:16:b2',
            isLogged: false
        }]);
    };


} else {
    module.exports = function(router_ip, cb) {
        request('http://' + router_ip + '/padrao?page=page_view_map', function(err, response, body) {
            if (err) {
                debug('Something wrong while crawling');
            }
            var handler = new htmlparser.DefaultHandler(function(err, dom) {
                if (err) {
                    debug('something went wrong while parsing');
                } else {
                    var pageBody = select(dom, '#page_body');
                    var trs = pageBody[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children;
                    var result = [];
                    for (var i = 0; i < trs.length; i++) {
                        if (i % 2 === 0) {
                            var isLogged = true;
                            var mac_address = trs[i].children[trs[i].children.length - 1].children[0].children[0].children[0].children[0].attribs.href;
                            if (trs[i].children[trs[i].children.length - 2].children[0].attribs.src === '/images/disconn_wireless.png') {
                                isLogged = false;
                            }
                            var mac = mac_address.match(/(..%3A)+../g)[0].replace(/%3A/g, ':');
                            result.push({
                                mac_address: mac,
                                isLogged: isLogged
                            });
                        }
                    }
                    cb(result);
                }
            });

            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(body);

        });
    };
}
