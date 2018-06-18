/*
	the old rest API version. 
	graphql: research: 
		error handling 
		code throwing 

*/
exports.get_all_notes = (req,res,db) => {
	console.log(req.body.id);
	db.any("select a.*, d.cat_name from categories_act a, categories c, categories_desc d where a.cat_id=d.cat_id and d.cat_id=c.cat_id and c.user_id ="+req.body.id)
		.then((notes)=>{
			res.json({"flag": "true", "message": "working", notes});
		})
		.catch((err)=> {
			console.log("notesjs.6: "+err);
			res.status(404).json({"flag":"false", "message":"could not find any notes for you"});
		});
}

exports.get_all_hashes = (req,res,db) => {
	db.any("select a.hash, d.cat_name, a.cat_id from categories_act a, categories c, categories_desc d where a.cat_id=d.cat_id and d.cat_id=c.cat_id and c.user_id ='"+req.body.id+"'")
		.then((notes)=>{
			console.log(notes);
			res.json({"flag": "awesome", "message": "working", notes});
		})
		.catch((err)=> {
			console.log("notesjs.6: "+err);
			res.status(404).json({"flag":"false", "message":"could not find any notes for you"});
		});
}

exports.get_select_notes = (req,res,db) => {
	//reformat ids to list and join to a string
	let ids = req.body.notes_id;
	try {
		ids = JSON.parse(ids);
		ids = ids.join("','");
	} catch(err) {
		res.send("error, not a proper list of note ids");
	}

	db.any("select a.*, d.cat_name from categories_act a, categories_desc d where a.cat_id=d.cat_id and a.cat_id IN ('"+ids+"')")
		.then((notes)=>{
			console.log(notes);
			res.json({"flag": "true", "message": "working", notes});
		})
		.catch((err)=> {
			console.log("notesjs.6: "+err);
			res.status(404).json({"flag":"false", "message":"could not find any notes for you"});
		});
}


