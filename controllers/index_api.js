//init vars***********************
var express = require("express");
var router = express.Router();
var Promise = require("promise");
var body = require("body-parser");
var { GraphQLString,
		GraphQLID,
		GraphQLInputObjectType,
		GraphQLObjectType,
		buildSchema
	} = require('graphql');
var express_graphql = require("express-graphql");

//jwt ***********************
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config/config");

//psql***********************
var initOptions = {
    promiseLib: Promise
};
var pgp = require("pg-promise")(initOptions);
var con = {
    user: config.user,
		host: config.host,
		port: config.port,
    password: config.psql,
    database: config.db
};
var db = pgp(con);

//models***********************
var user = require("../models/user");
var notes = require("../models/notes");

//middlewares***********************
router.use(body());

function verify_user(req,res,next){
	let token = req.body.token; 
	if (!token){
		return res.status(404).json({"flag": "false", "message": "User not Authenticated, please re-login"});
	} else {
		jwt.verify(token, config.secret, function(err, decoded){
			if (err) return res.status(404).json({"flag": "false", "message": "User not Authenticated, please re-login"});
			req.body.id = decoded.id;
			next();
		});
	}
}

function verify_graphql_vars(req,res,next){
	let token = req.body.variables.ID; 
	if (!token){
		return res.status(404).json({"flag": "false", "message": "User not Authenticated, please re-login"});
	} else {
		jwt.verify(token, config.secret, function(err, decoded){
			if (err) return res.status(404).json({"flag": "false", "message": "User not Authenticated, please re-login"});
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
var notes_ql = buildSchema('\
    type Query {notes(id: String!): [Note], \
      notes_cat_id(cat_ids: [String]!, id: String!): [Note]\
			notes_type(notes: [Note_Type]!, id:String!): [Note]\
		}, \
		type Note {cat_id: String, cat_name: String, data: [Note_Action]},\
		type Note_Action{ type: String, content: String, date: String,hash: String  }\
		type Hash {cat_id: String,hash: String, date: String}\
		input Note_Type {cat_id: String, cat_name: String, data: [Type_Data] }\
		input Type_Data {type: String}\
	type Mutation {all_notes_input(notes: [Note_Input]!, user_id: String!, flag: String!): [Hash] }\
		input Note_Input { cat_id: String!, cat_name: String!, data: [Note_Data]! }\
		input Note_Data {type: String!, content: String!, hash: String!, date:String! } \
	');

var root = {
	notes: (arg) => notes.get_all_notes_graphql(arg,db),
	notes_type: (arg) => notes.get_from_types(arg,db),
	all_notes_input: (arg) => notes.insert_all_notes(arg,db),
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
	graphiql: true
}));

module.exports = router;
