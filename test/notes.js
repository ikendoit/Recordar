const chai = require("chai");
const {apiTest} = require("./lib/apiTest");
const expect = chai.expect;

describe("NOTES TESTING", ()=>{

	it('GET /api/notes, should return 400 ', (done)=> {

		apiTest({
			method: "get",
			route: "/api/notes", 
			code: 400, 
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
				response: (res) => {
				},
				code: 200, 
			},done);

		});

	});

	describe("MUTATION", ()=>{

		it('POST /api/notes, mutation of empty notes, should return 200 ', (done)=> {

			let notes = [
				{
					"cat_id": "AA844",
					"cat_name": "Educational",
					"data": [
						{
							"type": "daily",
							"content": "<div>Am  daily Educational <div> category </div> status</div>",
							"hash": "hashingorking??yeahw",
							"date": "2017-07-11 11:15:54"
						},
						{
							"type": "monthly",
							"content": "<div>changing date of monthly educational</div>",
							"hash": "hashingorking??yeahw",
							"date": "2017-07-31 11:15:54"
						}
					]
				}
			];

			apiTest({
				method: "post",
				route: "/api/notes", 
				body: {
					variables: { 
						Notes : [{}], 
						Flag: false,
						ID: 1,
					}, 
					query: "mutation($Notes: [Note_Input]!, $Flag: String!, $ID: String!) { all_notes_input(notes: $Notes, user_id:$ID, flag: $Flag) {hash}}",
				},
				response: (res)=> {
				},
				code: 200, 
			},done);

		});

	});

});
