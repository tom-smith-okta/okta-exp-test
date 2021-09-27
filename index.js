require('dotenv').config()

const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

const mustacheExpress = require('mustache-express')

const Mustache = require('mustache')

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
// const API_SERVICE_URL = "https://microdemos.oktapreview.com";
// const API_SERVICE_URL = "https://udp-expedia-oie.oktapreview.com";
// const API_SERVICE_URL = "https://expedia-oie.dannyfuhriman.com"


// Logging
app.use(morgan('dev'));
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('html', mustacheExpress())

app.set('view engine', 'html')

//////////////////////////////////////////////////
// ROUTES
//////////////////////////////////////////////////

require('./routes/authz_code')(app)

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service.');
});


app.get('/', function (req, res) {

	let obj = {
        client_id: process.env.client_id,
        proxy_uri: process.env.proxy_uri,
        redirect_uri: process.env.proxy_uri,
		title: "home"
	}

	res.render ('index', obj)
})

app.get('/info', (req, res, next) => {
    res.send('This is a proxy service.');
});

 app.use('/*', createProxyMiddleware({
    // target: API_SERVICE_URL,
    target: process.env.issuer,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
 }));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
