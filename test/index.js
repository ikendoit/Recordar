const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("GRAPH QL NOTES DATA", ()=>{

	it('Mock main /api/, get should return 200', (done)=> {

    apiTest({
      route: "/api", 
      code: 200, 
      response: (err,res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.text).to.equal('hello');
      }
    },done);

	});

});
