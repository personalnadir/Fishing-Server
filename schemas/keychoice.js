  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var KeyChoiceSchema = new Schema({
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
	}
	millis: {
		type: Number,
		required: true,
		min: [0, 'Invalid millis time']
	},
	correctKey: {
		type: String,
		trim: true,
		required: true,
		enum: ['KeyX', 'KeyC', 'KeyN', 'KeyM']
	},
	userSelectedKey: {
		type: String,
		trim: true,
		required: true,
		enum: ['KeyX', 'KeyC', 'KeyN', 'KeyM']
	},
});

const model = mongoose.model('KeyChoice', KeyChoiceSchema);
module.exports = model;