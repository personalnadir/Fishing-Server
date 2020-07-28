  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var GallerySchema = new Schema({
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
	correctImages: {
		type: [String],
		required: true,
		validate: {
			validator: function(v) {
				return v.length == 6;
			},
			message: props => `${props.path} must have length 6, got '${props.value.length}'`
		},
	},
	imagesSelected: {
		type: [String],
		required: true,
		validate: {
			validator: function(v) {
				return v.length == 6;
			},
			message: props => `${props.path} must have length 6, got '${props.value.length}'`
		},
	}
});

const model = mongoose.model('Gallery', GallerySchema);
module.exports = model;