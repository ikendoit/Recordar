const { validateKeys } = require("./utils/validate");
const { checkConstraints } = require("./utils/constrainter");

/*
	login function 
	get POST method: username + password
	return: json: token + flag (true/false)
*/
exports.login = async (req,res,jwt,config,db) => {

	try {
		if ( !checkConstraints(req.body, {
						username: ["no_special"],
						password: ["no_special"]
					})
				) {
			throw new Error("Invalid username and password");
		};
		req.body = validateKeys(["password", "username"], req.body);

		let user = await db.any("select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'")
		if (user.length === 0) {
			throw new Error("User Does Not Exist");
		}
		let token = jwt.sign({id: user[0].id, username: user[0].username}, config.secret, {
			expiresIn: 300000000
		});
		res.status(200).json({"token":token, "flag":"true"});

	} catch(err) {
		res.status(400).send({"flag":"false", "error":err.message});
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

		if ( !checkConstraints(req.body, {
						username: ["no_special"],
						password: ["no_special"],
						email: ["is_string", "is_email"],
					})
			) {
			throw new Error("Invalid registering information");
		};

		if ( await checkUsernameExists(db, req.body.username)){
			throw {code:400, error:"Username already exist"};
		};

		let user = await db.any("INSERT INTO users(username,password,email) values('"+req.body.username+"','"+req.body.password+"','"+req.body.email+"') returning id, username")
		let token = jwt.sign({id: user[0].id, username: user[0].username}, config.secret, {
			expiresIn: 3000000000
		});

		res.status(200).json({"token":token, "flag":"true"});

	} catch (err) {
		res.status(400).send({"flag":"false", "error":err.message});
	}
}

async function checkUsernameExists(db, username) {
	return await db.any(`select * from users where username='${username}'`)
		.then((user) => user.length > 0);
}
