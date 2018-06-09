const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("USER TESTING", ()=>{
	describe("USER LOGIN", ()=> {

		it('Mock main /api/user/login, get should return 404', (done)=> {

			apiTest({
				route: "localhost:8089/api/user/login", 
				code: 404, 
			},done);

		});

		it('Mock main /api/user/login, POST with insufficient data, should return 400', (done)=> {

			apiTest({
				route: "/api/user/login", 
				post: {
				},
				response: (res) => {
					console.log(res);
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/login, POST with unknown account data, should return 400', (done)=> {

			apiTest({
				route: "/api/user/login", 
				post: {
					username: "test1",
					password: "' or ='1"
				},
				response: (res) => {
					console.log(res);
				},
				code: 400, 
			},done);

		});

	});

	describe("USER REGISTER", ()=>{

		it('Mock main /api/user/register, get should return 404', (done)=> {

			apiTest({
				route: "/api/user/regsiter", 
				response: (res) => {
					console.log(res);
				},
				code: 404, 
			},done);

		});

		it('Mock main /api/user/register, insufficient POST should return 400 ', (done)=> {

			apiTest({
				route: "/api/user/register", 
				post: {
				},
				code: 400, 
			},done);

		});

		it('Mock main /api/user/register, invalid POST should return 400 ', (done)=> {

			apiTest({
				route: "/user/register", 
				post: {
					username: "testtest",
					passord: "' or '1'='1"
				},
				code: 404, 
			},done);

		});

		it('Mock main /api/user/register, invalid POST should return 400 ', (done)=> {

			apiTest({
				route: "/user/register", 
				post: {
					username: "test0",
					passord: "' '='1",
					email : "" ,
					name : ""
				},
				code: 400, 
			},done);

		});

	});

});
