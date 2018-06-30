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
				code: 400, 
			},done);

		});

		it('Mock main /api/user/login, POST correct, should return 200', (done)=> {

			return apiTest({
				method: "post",
				route: "/api/user/login", 
				body: {
					username: "test1",
					password: "test1"
				},
				code: 200, 
			},done);

		});



	});

	describe("USER REGISTER", ()=>{

		it('Mock main /api/user/register, get should return 404', (done)=> {

			apiTest({
				method: "get",
				route: "/api/user/regsiter", 
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

		it('Mock main /api/user/register, valid post should return new user info + 200 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/user/register", 
				body: {
					username: "testNewTest",
					password: "aTestOfTime",
					email : "joe@gmail.com" ,
					name : "boon ba boom"
				},
				code: 200, 
			},done);

		});



	});

});
