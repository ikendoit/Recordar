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
					console.log(res.body);
					console.log(res.data);
					console.log(res.notes);
					//expect(res.notes.length > 1).to.be.true;
				},
				code: 200, 
			},done);

		});

		it('POST /api/notes,limited fields should return 200 ', (done)=> {

			apiTest({
				method: "post",	
				route: "/api/notes", 
				body: {
					query: "query($ID:String!) { notes(id: $ID){cat_name,data { type }} }",
					variables: {
					} 
				},
				response: (res) => {
					//expect(res.notes[0].cat_id === undefined).to.be.true;
				},
				code: 200, 
			},done);

		});

		it('POST /api/notes,unknown fields should return 400 ', (done)=> {

			apiTest({
				method: "post",	
				route: "/api/notes", 
				body: {
					query: "query($ID:String!) { notes(id: $ID){ cat_age, data { typii, data }} }",
					variables: {
						ID: 1 
					} 
				},
				response: (res) => {
				},
				code: 400, 
			},done);

		});

		it('POST /api/notes,invalid user token should return 400 ', (done)=> {

			apiTest({
				method: "post",	
				route: "/api/notes", 
				body: {
					query: "query($ID:String!) { notes(id: $ID){ cat_age, data { typii, data }} }",
					// note: the middleware only allow userID=1 to pass, else we need a valid JWT
					variables: {
						ID: 5 
					} 
				},
				response: (res) => {
					console.log(res.error);
				},
				code: 400, 
			},done);

		});

	});

	describe("MUTATION", ()=>{

		it('POST /api/notes, mutation of empty notes, should return 200 ', (done)=> {

			let validNotes = [
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
						Notes : [], 
						Flag: true,
						ID: 1,
					}, 
					query: "mutation($Notes: [Note_Input]!, $Flag: String!, $ID: String!) { all_notes_input(notes: $Notes, user_id:$ID, flag: $Flag) {hash}}",
				},
				code: 200, 
			},done);

		});
});

});
