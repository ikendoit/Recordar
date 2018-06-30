'use strict';

const {validateKeys} = require("./utils/validate");

//GRAPH QL ********************************************************

//NOTE Format:
/*
	note: 
		cat_id 
		cat_name 
		data: []
			type 
			hash
			content
			date
*/

/*
	Generate summarized data for graphql 'Note' data type
*/
function summarize(notes){

	let summ = [];
	for (let note of notes){
		let contained = false;
		for (let cat of summ){

			//check if summarized array already has this cat_name and cat_id
			if (cat.cat_id === note.cat_id && cat.cat_name === note.cat_name){
				cat.data.push({
					type: note.type, 
					date: note.date, 
					hash: note.hash, 
					content: note.content
				});
				contained = true; 
				break;
			} else {
				contained = false;	
			}
		}
		if (! contained) {
			summ.push({
				cat_id: note.cat_id,
				cat_name: note.cat_name,
				data: [
					{
						type: note.type, 
						content: note.content, 
						date: note.date, 
						hash: note.hash
					}
				]
			});
		}

	}

	return summ;

}

//*********************************** QUERIES
/*
	get all data based on user id
*/
exports.get_all_notes_graphql = async (arg, db) => {

	try {
		console.log("getting all notes");
		validateKeys(["id"], arg);
		return await db.any("select a.*, c.cat_name from categories_act a, categories c where c.cat_id=a.cat_id and c.user_id=a.user_id and c.user_id ='"+arg.id+"'")
			.then((resJSON) => {
				return summarize(resJSON);
			})
			.catch((err)=> {
				console.log(err);
				return [{"error": "error fetching data"}];
			});
	} catch(err) { 
		console.log(err);
		throw new Errors("invalid user id");
	}

}


/*
	query data based on format: 
	@param: arg.notes:
		cat_id 
		cat_name 
		data: [] 
			type
	@param: arg.id : user_id
	@return: 
		cat_id 
		cat_name 
		data: []
			type
			content 
			date
			hash
*/
exports.get_from_types = async (arg,db)=> {
	let notes = arg.notes;

	//craft the query string
	let query = "";
	for (let note of notes){
		query+= " and a.cat_id='"+note.cat_id+"' AND a.type IN (''";	
		query+=note.data.reduce((all, type)=> all+",'"+type.type+"'", "");
		query+= ")) ";
	}
	return await db.any("select DISTINCT a.*, c.cat_name from categories_act a, categories c where a.cat_id=c.cat_id and a.user_id=c.user_id and a.cat_id=c.cat_id and c.user_id='"+arg.id+"'"+query)
		.then((res) => {
			return summarize(res);
		})
		.catch((err)=> {
			console.log("notesjs.18: "+err);
			return err;
		});
}

//******************************* INSERTION

exports.insert_all_notes = async (arg, db) => {

	try {
		validateKeys(["notes", "user_id", "flag"], arg);
		let hashes = [];
			if (arg.flag === "true"){
				await db.any("DELETE FROM categories WHERE user_id='"+arg.user_id+"'");
				await db.any("DELETE FROM categories_act WHERE user_id='"+arg.user_id+"'");
			}
		for (let note of arg.notes){
			hashes.push(await insert_note(note, arg.user_id, db));
		}
		return hashes;
	} catch(err) {
		console.log(err);
		throw err;
	}
}

/*
	insert notes based on format : 
	@params: 
		note: {}
			cat_id 
			cat_name 
			data []
				type
				content
				date
				hash
		user_id
		db   postgresql
	@return {}
		hash : fake hash, temporary TODO
		cat_id: fake cat_id, temporary TODO
*/
async function insert_note(note,user_id,db){

	try { 
		validateKeys(["cat_name", "cat_id"], note);
		// insert new category and name: 
		await db.any(`\
			INSERT INTO categories(cat_id, cat_name, user_id) VALUES \
				('${note.cat_id}','${note.cat_name}','${user_id}') \
			ON CONFLICT ON CONSTRAINT categories_pkey \
				DO UPDATE SET cat_name='${note.cat_name}' \
			`)

		// for every act of each note: add it in 
		for (let data of note.data){
			//parse data.date: 
			if ( !/^[0-9]{4}\-[0-9]+\-[0-9]+ [0-9]+\:[0-9]+\:[0-9]+/.test(data.date)){
				console.log(`nope ${data.date}`);
				throw new Error("Invalid Time Format");
			}
			await db.any(`\
					INSERT INTO categories_act(cat_id, type, content, hash, date,user_id) VALUES\
						('${note.cat_id}','${data.type}','${data.content}','${data.hash}','${data.date}','${user_id}')\
					ON CONFLICT(cat_id, user_id, type) \
						DO \
							UPDATE SET content='${data.content}', hash='${data.hash}', date='${data.date}'\
				`)
		}

		return {"hash": "temp_hash, not_for_any_feature", "cat_id": note.cat_id};
	} catch(err) {
		throw err;
	}
}

//*************************************************************

