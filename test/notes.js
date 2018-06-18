const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("NOTES TESTING", ()=>{

	it('GET /api/notes, should return 500 ', (done)=> {

		apiTest({
			method: "get",
			route: "/api/notes", 
			code: 500, 
		},done);

	});

	describe("Notes get all", ()=> {

		it('POST /api/notes, should return 200 ', (done)=> {

			apiTest({
				method: "post",	
				route: "/api/notes", 
				body: {
					query: "query($ID:String!) { notes(id: $ID){cat_id, cat_name,data { type, date }} }",
					variables: {
						ID: 1 
					} 
				},
				code: 200, 
			},done);

		});

	});


	describe("MUTATION", ()=>{

		it('POST /api/notes, mutation of empty notes, should return 400 ', (done)=> {

			apiTest({
				method: "post",
				route: "/api/notes", 
				body: {
					variables: { 
						Notes : [{}], 
						ID: 1 
					}, 
					query: "query ($Notes: [Note_type]!, $ID: String! ) { notes_type(notes:$Notes, id:$ID){ cat_id, cat_name, data {type date content hash }} ",
				},
				code: 200, 
			},done);

		});

	});

});
