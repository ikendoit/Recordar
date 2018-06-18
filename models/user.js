const { validateKeys } = require("./utils/validate");

/*
	login function 
	get POST method: username + password
	return: json: token + flag (true/false)
*/
exports.login = async (req,res,jwt,config,db) => {

	try {

		req.body = validateKeys(["password", "username"], req.body);
		db.any("select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'")
			.then(function(user){
				let token = jwt.sign({id: user[0].id, username: user[0].username}, config.secret, {
					expiresIn: 300000000
				});
				res.status(200).json({"token":token, "flag":"true"});
			})
			.catch( err => consoel.log(err));
	} catch(err) {
		res.status(400).send({"flag":"false", "error":"cannot query this user"});
	}

}

/*
	register function 
	get POST method: username + password + email
	return: json: token + flag (true/false)
*/
exports.register = async (req,res,jwt,config,db) => {

	try {
		req.body = validateKeys(["password", "username", "email"], req.body);

		if (await checkUsernameExists(db, req.body.username)){
			throw {code:400, error:"Username already exist"};
		};

		await db.any("INSERT INTO users(username,password,email) values('"+req.body.username+"','"+req.body.password+"','"+req.body.email+"') returning id, username")
			.then(function(user){
				let token = jwt.sign({id: user[0].id, username: user[0].username}, config.secret, {
					expiresIn: 3000000000
				});
				res.status(200).json({"token":token, "flag":"true"});
			})
			.catch( err => console.log(err));
	} catch (err) {
		res.status(400).send({"flag":"false", "error":"cannot register user, try another username or password"});
	}
}

async function checkUsernameExists(db, username) {
	return await db.any(`select * from users where username='${username}'`)
		.then((user) => user.length > 0);
}
