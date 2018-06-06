require("dotenv").config();
const env = process.env;

module.exports = {
	"secret": env.RECORDAR_SECRET,
	"psql": env.RECORDAR_PSQL_PASSWORD,
	"user": env.RECORDAR_PSQL_USER,
	"host": env.RECORDAR_HOST,
	"db":  env.RECORDAR_DB
}
