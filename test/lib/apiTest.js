const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("request");
const expect = chai.expect;
chai.use(chaiHttp);

const host = process.env.RECORDAR_HOST_URL;

/*
	do testing on the route
	@param: {} : 
            route: end point to test eg: /api/user/login
						post : post data eg: {username: '111', password: '2323'}
						code : expected code eg: 200, 404 ...
						response: call back function to check eg: (err,res)=> {}
*/
exports.apiTest = (dataTest,done) => (
		chai.request(host)
			.get(dataTest.route)
			.end((err,res)=> {

				if ( "response" in dataTest ){
					dataTest.response(err,res);
				}
				expect(res.statusCode).to.equal(dataTest.code);
				done();
			})
)
