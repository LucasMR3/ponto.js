# ponto.js


ponto.js is a simple tool to check the router for a mac address on a list and record it's login/logout movements. We use this internally in our company, in order to account for our employments working hours ( using their cellphones` mac adresses to track their presence! ).

### Version
0.0.1

### Installation
(gotta have `mongodb` and `nodejs`)

First, clone this repo:

```sh
$ git clone https://github.com/cesarvargas00/ponto.js.git
```

Tinker with **./src/config.js** and use `MOCK:false`:

```js
module.exports = {
  ROUTER_IP:'192.168.1.1',
  DB_ADDR:'mongodb://localhost/pontoEletronico',
  INTERVAL:5000,
  MOCK: true
};
```

Pray that your router is the same as ours ( or change **./src/crawler.js** to your taste):

![!Mock hard, Pray hard](https://m.popkey.co/e4056d/Klp0D.gif)

Then, install forever and run **./src/app.js**:
```sh
$ npm install -g forever
$ forever start ./src/app.js
```

***Booya! Have fun tracking your bit\*hes!!***

![Imma track your ass](https://m.popkey.co/4f0b2a/9MJjD.gif)


License
----

MIT