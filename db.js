const mongoose = require('mongoose');
const conf=require("./config.js");
const connectionString = conf.get('database.uri');
mongoose.connect(connectionString, {
	useUnifiedTopology: true,
	useNewUrlParser : true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log('connected to mongodb!');
})