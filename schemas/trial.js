  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var TrialAttemptSchema = new Schema({
	participant: {
		type: String,
		trim: true,
		required: true
	} ,
	date: {
		type: Date,
		required: true
	} ,
	millis: {
		type: Number,
		required: true,
		min: [0, 'Invalid millis time']
	} ,
	stimulusCategory: {
		type: String,
		trim: true,
		required: true,
		enum: ['Fish', 'Crab']
	} ,
	phase: {
		type: String,
		trim: true,
		required: true,
		enum: ['PHASE1_PRACTICE', 'PHASE1', 'PHASE2_PRACTICE', 'PHASE2', 'PHASE3']
	} ,
	trial: {
		type: Number,
		required: true,
		min: [0, 'Invalid trial number']
	} ,
	trialTime: {
		type: Number,
		required: true,
		min: [0, 'Invalid trial time']
	} ,
	rule: {
		type: String,
		trim: true,
		required: true,
		enum: ['Accept', 'Reject', 'Tax', 'Subsidy']
	} ,
	image: {
		type: String,
		trim: true,
		required: true
	} ,
	filePath: {
		type: String,
		trim: true,
		required: true
	} ,
	block: {
		type: Number,
		required: true,
		min: [1, 'Invalid block number']
	} ,
	blockStartTime: {
		type: Number,
		required: true,
		min: [0, 'Invalid block start time']
	} ,
	stimulusTime: {
		type: Number,
		required: true,
		min: [0, 'Invalid stimulus time']
	} ,
	correctKey: {
		type: String,
		trim: true,
		required: true,
		enum: ['KeyX', 'KeyC', 'KeyN', 'KeyM']
	} ,
	pressedKey: {
		type: String,
	} ,
	reactionTime: {
		type: Number,
	} ,
	correct: {
		type: Boolean,
		required: true
	},
	rewardChange: {
		type: Number
	},
	rewardTotal: {
		 type: Number
	}
  });

const model = mongoose.model('TrialAttempt', TrialAttemptSchema);
module.exports = model;