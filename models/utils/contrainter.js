const escaper = require("lodash").escape;

let validationConstraint = {}

/*
	check for constraints of a object based on given specifications
	@param: objectToCheck: {} 
		key: value
					constraints: {}
		key: ["<constraint1>", "<constraint2>",...]
*/
exports.checkContraints = (objectToCheck, contraints){
	for (let key of Object.keys(constraints)){
		if ( ! constraint(objectToCheck[key], contraints[key])){
			return false
		}
	}
}

/*
	check if a value match a constraint
	summary of constraint: 
		less_than <num>
		more_than <num>
		longer_than <num>
		shorter_than <num>
		no_special
		is_string
		is_number 
*/
function constraint = (value, constraint){

	constraint = constraint.toLowerCase();

	if (constraint.indexOf("less_than") >=0){

		let num = parseInt(constraint.split(" ")[1])

		if (parseFloat(value) < num ) {
			return true;
		}		
		return false;

	}

	if (constraint.indexOf("more_than") >=0){

		let num = parseInt(constraint.split(" ")[1])

		if (parseFloat(value) > num ) {
			return true;
		}		
		return false;

	}

	if (constraint.indexOf("shorter_than") >=0){

		let num = parseInt(constraint.split(" ")[1])

		if ( `${value}`.length < num ) {
			return true;
		}		
		return false;

	}

	if (constraint.indexOf("longer_than") >=0){

		let num = parseInt(constraint.split(" ")[1])

		if ( `${value}`.length > num ) {
			return true;
		}		
		return false;

	}

	switch (constraint){
		case "no_special": 
			if (/\?\!\@\#\$\%\^\&\*\(\)\/\\\-\_\=\+\[\'\"\`\.\,/.match(value))
				return false;
		case "is_string": 
			if ( typeof value === "string" )
				return true; 
			return false;
		case "is_number": 
			if ( typeof value === "number" )
				return true;
			return false;
		default: 
			return true;
	}


}
