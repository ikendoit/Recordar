/*
	check if an object has (key - value) pairs
	@params: arrKeys: array of keys to check
					 objectCheck: object to check for keys existence
	@return: throw error 'Invalid Data' if not correct
*/
exports.validateKeys = (arrKeys, objectCheck) => {
	if ( ! arrKeys.every((key) => key in objectCheck && objectCheck[key] !== undefined) ){
		throw 'Invalid Data';
	}
}
