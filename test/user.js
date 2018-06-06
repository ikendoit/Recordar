const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("GRAPH QL NOTES DATA", ()=>{
	it('Mock main /api/user/signup, get should return 404', (done)=> {

    apiTest({
      route: "/user/signup", 
      code: 404, 
    },done);

	});

	it('Mock main /api/user/signup, get should return 404', (done)=> {

    apiTest({
      route: "/user/login", 
      code: 404, 
    },done);

	});

});
