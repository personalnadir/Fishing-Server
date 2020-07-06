const TrialAttemptModel = require ('./schemas/trial');
const JsonStreamStringify = require('json-stream-stringify');

function handleError(context, err, obj) {
	console.error(`TrialDocuments: ${err} ` + obj);
}

function saveTrial(data) {
	TrialAttemptModel.create(data, err => {
		if (err) {
			handleError('saving trial attempt', err, data);
		}
	});
}

function fetchParticipantsStream(){
	const cursor = TrialAttemptModel.distinct('participant').exec();

	const jsonStream = new JsonStreamStringify(cursor);
	jsonStream.once('error', () => console.log('Error at path', jsonStream.stack.join('.')));

	return jsonStream;
}

function fetchDataStream(participant){
	const cursor = TrialAttemptModel.find({participant}).exec();

	const jsonStream = new JsonStreamStringify(cursor);
	jsonStream.once('error', () => console.log('Error at path', jsonStream.stack.join('.')));

	return jsonStream;
}


exports.saveTrial = saveTrial;
exports.fetchParticipantsStream = fetchParticipantsStream;
exports.fetchDataStream = fetchDataStream;