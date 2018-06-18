const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("USER TESTING", ()=>{
	describe("USER LOGIN", ()=> {

		it('Mock main /api/user/login, get should return 404', (done)=> {

			return apiTest({
				method: "get",
				route: "/api/user/login", 
				code: 404, 
			},done);

		});

		it('Mock main /api/user/login, POST with insufficient data, should return 400', (done)=> {

			return apiTest({
				method: "post",
				route: "/api/user/login", 
				body: {
				},
				response: (err,res) => {
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/login, POST with sql injection, should return 404', (done)=> {

			return apiTest({
				method: "post",
				route: "/api/user/login", 
				body: {
					username: "test1",
					password: "' or '1'='1"
				},
				response: (err, res) => {
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/login, POST with unknown account data, should return 404', (done)=> {

			return apiTest({
				method: "post",
				route: "/api/user/login", 
				body: {
					username: "tetditmanh",
					password: "' ohfdsafasdfhr"
				},
				response: (err, res) => {
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/login, POST with wrong password, should return 404', (done)=> {

			return apiTest({
				method: "post",
				route: "/api/user/login", 
				body: {
					username: "test1",
					password: "' hfdsafasdfhr"
				},
				response: (err, res) => {
				},
				code: 400, 
			},done);

		});


	});

	describe("USER REGISTER", ()=>{

		it('Mock main /api/user/register, get should return 404', (done)=> {

			apiTest({
				method: "get",
				route: "/api/user/regsiter", 
				response: (err,res) => {
				},
				code: 404, 
			},done);

		});

		it('POST /api/user/register, no data in body should return 400 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/user/register", 
				body: {
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/register, sql injection POST should return 400 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/user/register", 
				body: {
					username: "'; create role hackerman; update table users set password='1'; select * where password like '%%",
					password: "' or '1'='1",
					email: "email@email.com"
				},
				response: (err, res)=> {
				},
				code: 400, 
			},done);

		});

		it('POST /api/user/register, account name exists should return 400 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/user/register", 
				body: {
					username: "test1",
					password: "' nope, don't exist",
					email : "" 
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/register, invalid POST field should return 400 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/user/register", 
				body: {
					usenam: "test0",
					password: "' ='1",
					email : "" ,
					name : ""
				},
				code: 400, 
			},done);

		});


	});

});
