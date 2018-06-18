const fs = require("fs");

let readFile = (fileName) => {
	return fs.readFileSync(`${__dirname}/../schemas/${fileName}`, {encoding: "utf8"})
}

let getNotesSchema = () => {

	return readFile("notesSchema.schema");
}
module.exports = { getNotesSchema };
