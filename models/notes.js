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

	console.log("querying notes");
	return await db.any("select a.*, c.cat_name from categories_act a, categories c where c.cat_id=a.cat_id and c.user_id=a.user_id and c.user_id ='"+arg.id+"'")
		.then((resJSON) => {
			return summarize(resJSON);
		})
		.catch((err)=> {
			console.log("notejs.19: "+err);
		});
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
		});
}

//******************************* INSERTION

exports.insert_all_notes = async (arg, db) => {

	console.log("inserting notes");
	let hashes = [];
    if (arg.flag === "true"){
        await db.any("delete from categories where user_id='"+arg.user_id+"'");
        await db.any("delete from categories_act where user_id='"+arg.user_id+"'");
    }
	for (let note of arg.notes){
		hashes.push(await insert_note(note, arg.user_id, db));
	}
	return hashes;
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
	// insert new category and name: 
	await db.any("update categories set cat_name='"+note.cat_name+"' where user_id='"+user_id+"' and cat_id='"+note.cat_id+"' ")
		.catch((err)=> { 
		});
	await db.any("insert into categories(cat_id, cat_name, user_id) values('"+note.cat_id+"','"+note.cat_name+"','"+user_id+"')")
		.catch((err)=> { 
		});
	// for every act of each note: add it in 
	for (let data of note.data){
		//parse data.date: 
		if ( !/^[0-9]{4}\-[0-9]+\-[0-9]+ [0-9]+\:[0-9]+\:[0-9]+/.test(data.date)){
			console.log("nope");
			console.log(data.date);
			return {"hash": "hashable, invalid date", "cat_id":"wrong date dude"};
		}
		await db.any("update categories_act set content='"+data.content+"', hash='"+data.hash+"', date='"+data.date+"' where user_id='"+user_id+"' and cat_id='"+note.cat_id+"' and type='"+data.type+"' ")
			.catch((err)=> { 
			});
		await db.any("insert into categories_act(cat_id, type, content, hash, date,user_id) values('"+note.cat_id+"','"+data.type+"','"+data.content+"','"+data.hash+"','"+data.date+"','"+user_id+"')")
			.catch((err)=> { 
			});
	}
	return {"hash": "hashable until replace works", "cat_id": "any cat you want, cat heaven"};
}
