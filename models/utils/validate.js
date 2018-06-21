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

	return this.sanitizeValues(objectCheck);

}

/*
	sanitize input in a key-value object
	recursively go through every string value in the object, escape them
	@params: objectCheck: array of keys to check
	@return: new object with sanitized values
*/
exports.sanitizeValues = (objectCheck) => {

	if (typeof(objectCheck) !== "object") return escaper(objectCheck);

	for (let key of Object.keys(objectCheck)){
		let currentKeyVal = objectCheck[key];
		if (typeof(currentKeyVal) === "object"){
			currentKeyVal = this.sanitizeValues(currentKeyVal)
		} else {
			objectCheck[key] = escaper(objectCheck[key]);
		}
	}
	return objectCheck;

}
