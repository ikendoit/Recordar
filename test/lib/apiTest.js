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
						method: http request method
						post : post data eg: {username: '111', password: '2323'}
						code : expected code eg: 200, 404 ...
						response: call back function to check eg: (err,res)=> {}
*/
exports.apiTest = (dataTest,done) => {

	const params = {

		route: host+dataTest.route,

		body: {
			body: JSON.stringify(dataTest.body || {}),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
		},

		callBack: (err,res,body) => {
			if (err) {
				console.log(err)
				return;
			}
			
			if ( "response" in dataTest ){
				dataTest.response(res,body);
			}
			expect(res.statusCode).to.equal(dataTest.code);
			done();
		}

	}

	switch(dataTest.method.toUpperCase()){
		case "GET" : 
			request.get(params.route, params.callBack);
			break;
		case "POST":
			request.post(params.route, params.body, params.callBack);
			break;
		case "PUT":
			request.put(params.route, params.body, params.callBack);
			break;
		case "DELETE":
			request.delete(params.route, params.body, params.callBack);
			break;
		case "PATCH":
			request.patch(params.route, params.body, params.callBack);
			break;
		default: 
			request.get(params.route, params.callBack);
			return;
	}

}
