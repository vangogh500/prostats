module.exports = {
	mongo: {
		connectionString: 'mongodb://'+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/'
	}
};