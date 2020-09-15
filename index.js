const express = require('express');
const cors = require('cors');
const db = require ('./db');
const auth = require("http-auth");
const { insert, fetchParticipantsStream, fetchDataStream} = require('./documentmanager');
const TrialAttemptModel = require ('./schemas/trial');
const KeyChoiceModel = require ('./schemas/keychoice');
const VASModel = require ('./schemas/vas');
const GalleryModel = require ('./schemas/gallery');

const { pipeline } = require('stream');
const { Transform } = require('json2csv');
const conf=require("./config.js");
const _=require ("underscore");

const basic = auth.basic({
		realm: "Download"
	},
	(username, password, callback) => callback(username === conf.get("auth.user") && password === conf.get("auth.password"))
);

const app = express();

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/keys', function (req, res, next) {
	insert(KeyChoiceModel, req.body);
  	res.json(req.body);
});

app.post('/vas', function (req, res, next) {
	insert(VASModel, req.body);
  	res.json(req.body);
});

app.post('/gallery', function (req, res, next) {
	insert(GalleryModel, req.body);
  	res.json(req.body);
});

app.post('/store', function (req, res, next) {
	insert(TrialAttemptModel, req.body);
  	res.json(req.body);
});

app.get('/login/:id', function (req, res, next) {
	const {id: loginStr} = req.params;
	const login = parseInt(loginStr, 10);
	if (!Number.isInteger(login)) {
		res.json({
			error: 'All logins must be integers'
		});
		return;
	}
  	res.json({ab: login % 2 == 0 ? 'a' : 'b'});
});

app.get('/participants', function (req, res, next) {

	pipeline(fetchParticipantsStream(TrialAttemptModel), res,(err) => {
		if (err) {
			console.error('Pipeline failed.', err);
			next(err);
	    } else {
			console.log('Pipeline succeeded.');
	    }
	});
});

const json2csvFactory = {
	trials: ()=> {
		const opts = {
			fields: ["participant", "date", "millis", "stimulusCategory", "phase", "trial", "trialTime", "rule", "image", "filePath", "block", "blockStartTime", "stimulusTime", "correctKey", "pressedKey", "reactionTime", "correct", "rewardChange", "rewardTotal"]
		};
		return new Transform(opts);
	},
	keys: ()=> {
		const opts = {
			fields: ["participant", "date", "millis", "questionnaire", "image", "correctKey", "userSelectedKey"]
		};
		return new Transform(opts);
	},
	vas: ()=> {
		const opts = {
			fields: ["participant", "date", "millis", "questionnaire", "value"]
		};
		return new Transform(opts);
	},
	gallery: ()=> {
		const opts = {
			fields: ["participant", "date", "millis", "questionnaire", "correctImages", "imagesSelected"]
		};
		return new Transform(opts);
	}
}

const dataModels = {
	trials: TrialAttemptModel,
	keys: KeyChoiceModel,
	vas: VASModel,
	gallery: GalleryModel
};

const dkeys = dataModels.keys();
const jkeys = json2csvFactory.keys();
const diff = _.difference(dkeys,jkeys);
console.assert(diff && diff.length > 0, `Missing keys! ${diff}`);

app.get('/data/:id/set/:set', basic.check((req, res) => {
	const {id: participant, set} = req.params;

	if (set in json2csvFactory === false){
		res.writeHead(204,{"Content-Type": "text/plain"});
		res.end();
		return;
	}

	const stream = fetchDataStream(dataModels[set], participant);

	if (!stream) {
		res.writeHead(204,{"Content-Type": "text/plain"});
		res.end();
		return;
	}
	res.setHeader("Content-disposition", `attachment; filename=${participant}.csv`);
	res.setHeader("Content-type", "text/csv");
	res.setHeader("Set-Cookie", "fileDownload=true; path=/");
	const transform = json2csvFactory[set]();
	pipeline(stream, transform, res,(err) => {
		if (err) {
		 	console.error('download failed.', err);
	    } else {
			console.log('download pipe succeeded.');
	    }
	});
}));

app.listen(conf.get("port"), function () {
  console.log(`Web server listening on port ${conf.get("port")}`)
});