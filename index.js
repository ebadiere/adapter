require('babel-polyfill');
require('dotenv').config();

axios = require('axios');

const createMetalsRequest = (input, callback) => {

    // Performing a GET request
    axios.get('http://metals-api.com/api/latest?base=USD&symbols=' + input.symbol + '&access_key=' + process.env.METALS_API_KEY, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .catch(function (error) {
            callback(500, {
                jobRunID: input.id,
                status: "errored",
                error: "Error querying Metals-API",
                statusCode: 500
            });
        })
        .then(function(response){
            jsonData = {};
            if(input.symbol === 'XAU'){
                jsonData['goldspot'] = response.data.rates.XAU;
            }

            if(input.symbol === 'XAG'){
                jsonData['silverspot'] = response.data.rates.XAG;
            }

            callback(200, {
                jobRunID: input.id,
                data: response.data.rates[input.symbol],
                statusCode: 200
            });
        });

};

const createQuandlRequest = (input, callback) => {

    // Performing a GET request
    axios.get('https://www.quandl.com/api/v3/datasets/LBMA/GOLD?column_index=1&rows=1&api_key=' + process.env.API_KEY, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .catch(function (error) {
            callback(500, {
                jobRunID: input.id,
                status: "errored",
                error: "Error querying metals",
                statusCode: 500
            });
        })
        .then(function(response){

            callback(200, {
                jobRunID: input.id,
                data: response.data.dataset.data[0][1],
                statusCode: 200
            });
        });

};

exports.metalsservice = (req, res) => {
    createMetalsRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data);
    });
};

exports.quandlservice = (req, res) => {
    createQuandlRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data);
    });
};
