const api_routing    = require("./controllers/index_api.js");
const express        = require("express");
const favicon        = require("serve-favicon");
const cors           = require("cors");
const helmet				 = require("helmet");
const sanitize			 = require("sanitize");

var app = express();

//middlewares
app.use(sanitize.middleware);
app.use(helmet());
app.use("/api/",api_routing);
app.use("/",express.static(__dirname+"/view/"));
app.use(cors());
//app.use(favicon(__dirname+"/view/favicon.ico"));

//listen 

if ( process.env.NODE_ENV === "PRODUCTION" ){

	let createServer = require("auto-sni");
	createServer({
		email: "<email>",
		domains: ["<domain>"],
		ports: {
			http: 80, 
			https: 443,
		},
		agreeTos: true,
	},app);

} else {

	app.listen(8089,"0.0.0.0",function(){
			console.log("listenning at port 8089: DEV ENV");
	});

}

