const JsonStreamStringify = require('json-stream-stringify');

function handleError(context, model, err, obj) {
	console.error(`Document Managers: ${model.modelName} ${err} ` + obj);
}

function insert(model, data) {
	model.create(data, err => {
		if (err) {
			handleError('Error saving ', model, err, data);
		}
	});
}

function fetchParticipantsStream(model){
	const cursor = model.distinct('participant').exec();

	const jsonStream = new JsonStreamStringify(cursor);
	jsonStream.once('error', () => console.log('Error at path', jsonStream.stack.join('.')));

	return jsonStream;
}

function fetchDataStream(model, participant){
	const cursor = model.find({participant}).exec();

	const jsonStream = new JsonStreamStringify(cursor);
	jsonStream.once('error', () => console.log('Error at path', jsonStream.stack.join('.')));

	return jsonStream;
}


exports.insert = insert;
exports.fetchParticipantsStream = fetchParticipantsStream;
exports.fetchDataStream = fetchDataStream;