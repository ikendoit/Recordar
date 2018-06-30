const escaper = require("lodash").escape;
const validate = require("validate.js");

let validationConstraint = {}

/*
	check for constraints of a object based on given specifications
	@param: objectToCheck: {} 
		key: value
					constraints: {}
		key: ["<constraint1>", "<constraint2>",...]
  @return boolean: if all value are valid
*/
exports.checkConstraints = (objectToCheck, constraints) => {
	for (let key of Object.keys(constraints)){
		if ( ! isValidConstraint(objectToCheck[key], constraints[key])){
			return false 
		}
	}
  return true;
}

/*
	check if a value match a constraint
	@param: value: value to check for constraint
  @return: boolean: false if invalid value
  NOTES: 
	summary of constraints: []
		less_than <num>
		more_than <num>
		longer_than <num>
		shorter_than <num>
		no_special
		is_string
		is_number 
*/
function isValidConstraint (value, constraints){

	for (let constraint of constraints){

		constraint = constraint.toLowerCase();

		if (constraint.indexOf("less_than") >=0){

			let num = parseInt(constraint.split(" ")[1])

			if (parseFloat(value) < num ) {
				continue
			}		
			return false;

		}

		if (constraint.indexOf("more_than") >=0){

			let num = parseInt(constraint.split(" ")[1])

			if (parseFloat(value) > num ) {
				continue
			}		
			return false;

		}

		if (constraint.indexOf("shorter_than") >=0){

			let num = parseInt(constraint.split(" ")[1])

			if ( `${value}`.length < num ) {
				continue
			}		
			return false;

		}

		if (constraint.indexOf("longer_than") >=0){

			let num = parseInt(constraint.split(" ")[1])

			if ( `${value}`.length > num ) {
				continue
			}		
			return false;

		}

		switch (constraint){
			case "no_special": 
				if (/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
					return false;
        continue;
			case "is_string": 
				if ( typeof value === "string" )
					continue
				return false;
			case "is_number": 
				if ( typeof value === "number" )
					continue
          break;
				return false;
      case "is_email": 
        if (/[a-zA-Z0-9]+\@\w+\.\w+/.test(value))
          continue;   
        return false
			default: 
				continue
		}

	}

  return true;

}
