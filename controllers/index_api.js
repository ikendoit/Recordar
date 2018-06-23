//init vars***********************
const express = require("express");
const router = express.Router();
const Promise = require("promise");
const body = require("body-parser");
const _ = require("lodash");
//graphql ***********************
const { GraphQLString,
		GraphQLID,
		GraphQLInputObjectType,
		GraphQLObjectType,
		buildSchema
	} = require('graphql');
const schemas = require("../schemas/index.js");
schemas.getNotesSchema();

const express_graphql = require("express-graphql");

//jwt ***********************
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

//psql***********************
const initOptions = {
    promiseLib: Promise
};
const pgp = require("pg-promise")(initOptions);
const con = {
    user: config.user,
		host: config.host,
		port: config.port,
    password: config.psql,
    database: config.db
};
const db = pgp(con);

//models***********************
const user = require("../models/user");
const notes = require("../models/notes");

//middlewares***********************
router.use(body());

function verify_user(req,res,next){
	let token = req.body.token; 
	if (!token){
		return res.status(400).json({"flag": "false", "message": "User not Authenticated, please re-login"});
	} else {
		jwt.verify(token, config.secret, function(err, decoded){
			if (err) return res.status(400).json({"flag": "false", "message": "User not Authenticated, please re-login"});
			req.body.id = decoded.id;
			next();
		});
	}
}

function verify_graphql_vars(req,res,next){
	// if id in variables === 1 => assume user is testing => let next()
	req.body.variables = {...req.body.variables, ID: 1}
	if (req.body.variables.ID === 1 ){
		next();
		return true;
	}

  if (_.isEmpty(req.body) || req.body === "{}") {
    res.status(400).json({"error": "invalid user token"});
		throw new Error("Invalid Data Input, need user token");
  }

	let token = req.body.variables.ID; 
	if (!token){
		res.status(400).json({"flag": "false", "message": "User not Authenticated, please re-login"});
	} else {
		jwt.verify(token, config.secret, function(err, decoded){
			if (err) res.status(400).json({"flag": "false", "message": "User not Authenticated, please re-login"});
			req.body.variables.ID=decoded.id;
			next();
		});
	}
}

function cors_localhost(req,res,next){
	// Website you wish to allow to connect
	//TODO: set to only my website
	res.setHeader('Access-Control-Allow-Origin','*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware

	if (req.method === "OPTIONS") {
			return res.status(200).end();
	}
	return next();
}

//GRAPHQL SET UP
//TODO: change userID from Int to String jwt
//Mutation return Hash is temporary, needs changing to (flag) or (message) or any other resolution
var notes_ql = buildSchema(schemas.getNotesSchema());

var root = {
	notes: (arg,context) => notes.get_all_notes_graphql(arg,db),
	notes_type: (arg,context) => notes.get_from_types(arg,db),
	all_notes_input: (arg,context) => notes.insert_all_notes(arg,db),
};

//routing***********************
router.get("/", function (req, res) {
	res.send("hello");
});

router.post("/user/login", function (req, res) {
	user.login(req,res,jwt,config,db);
});

router.post("/user/register", function (req, res) {
	user.register(req,res,jwt,config,db);
});

router.use('/notes',cors_localhost, verify_graphql_vars, express_graphql({
	schema: notes_ql, 
	rootValue: root, 
	pretty: true,
	graphiql: true
}));

module.exports = router;
