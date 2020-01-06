const express = require('express');
const bodyParser = require('body-parser');
const adapter = require('./index');

require ('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/goldspot', function (req, res) {
    adapter.quandlservice(req, res);
});

app.post('/spot/hourly/gold', function (req, res) {
    req.body.symbol = "XAU";
    adapter.metalsservice(req, res);
});

app.post('/spot/hourly/silver', function (req, res) {
    req.body.symbol = "XAG";
    adapter.metalsservice(req, res);
});


let listener = app.listen(process.env.PORT || 6221, function () {
    console.log("Adapter listening on", listener.address().address + listener.address().port);
});

process.on('SIGINT', function () {
    process.exit();
});
