const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("request");
const expect = chai.expect;
const app = require('../../index.js');
chai.use(chaiHttp);

const host = process.env.RECORDAR_HOST_URL;

/*
	do testing on the route
	@param: {} : 
            route: end point to test eg: /api/user/login
						method: http request method
						post : post data eg: {username: '111', password: '2323'}
						code : expected code eg: 200, 404 ...
						response: call back function to check eg: (err,res)=> {}
*/
exports.apiTest = (dataTest,done) => {
		if ( "post" in dataTest ){
			return chai.request(host)
				.post(dataTest.route)
				.send(dataTest.post)
				.end((err,res)=> {

					if ( "response" in dataTest ){
						dataTest.response(err,res);
					}
					expect(res.statusCode).to.equal(dataTest.code);
					done();
				})
		} else {
			
			return chai.request(host)
				.get(dataTest.route)
				.end((err,res)=> {

					if ( "response" in dataTest ){
						dataTest.response(err,res);
					}
					expect(res.statusCode).to.equal(dataTest.code);
					done();
				})

		}
}
