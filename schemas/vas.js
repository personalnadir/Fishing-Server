  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var VasSchema = new Schema({
	participant: {
		type: String,
		trim: true,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	questionnaire: {
		type: String,
		require: true
	},
	millis: {
		type: Number,
		required: true,
		min: [0, 'Invalid millis time']
	},
	value: {
		type: Number,
		required: true,
		min: [0, 'Invalid value, less than minimum'],
		max: [100, 'Invalid value, greater than maximum']
	}
});

const model = mongoose.model('VAS', VasSchema);
module.exports = model;