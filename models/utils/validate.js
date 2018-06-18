const sanitizer = require("sanitize")();
const escaper = require("lodash").escape;

/*
	check if an object has (key - value) pairs
	also sanitize the input with lodash.escape
	@params: arrKeys: array of keys to check
					 objectCheck: object to check for keys existence
	@return: throw error 'Invalid Data' if not correct
*/
exports.validateKeys = (arrKeys, objectCheck) => {

	if ( ! arrKeys.every((key) => key in objectCheck && objectCheck[key] !== undefined) ){
		throw {code: 400, errorMessage: 'Invalid Data'};
	}

	return this.sanitizeValues(arrKeys, objectCheck);

}

/*
	sanitize input in a key-value object
	@params: arrKeys: array of keys to check
					 objectCheck: object to check for keys existence
	@return: new object with sanitized values corresponding to key list
*/
exports.sanitizeValues = (arrKeys, objectCheck) => {

	for (let key of arrKeys){
		objectCheck[key] = escaper(objectCheck[key]);
	}
	return objectCheck;

}
