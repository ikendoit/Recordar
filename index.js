const api_routing    = require("./controllers/index_api.js");
const express        = require("express");
const favicon        = require("serve-favicon");
const cors           = require("cors");

var app = express();

//var api_routing = require("./controllers/index_api.js");
//var express = require("express");
//var favicon = require("serve-favicon");
//let cors = require('cors');
//var app = express();

//middlewares
	app.use("/api/",api_routing);
    app.use("/",express.static(__dirname+"/view/"));
	app.use(cors());
	//app.use(favicon(__dirname+"/build/favicon.ico"));

//listen 
    app.listen(8089,"0.0.0.0",function(){
        console.log("listenning at port 8089");
    });

	//var createServer = require("auto-sni");
	//createServer({
	//	email: "ikendoit1998@gmail.com",
	//	domains: ["recordar.cf", "www.recordar.cf"],
	//	ports: {
	//		http: 80, 
	//		https: 443,
	//	},
	//	agreeTos: true,
	//},app);
