var async = require('async');
var BU_API = require('./BUAPI');

async.waterfall([
	function(done) {

		console.log('Testing .colleges');

		BU_API.colleges(function(err, colleges){
			console.assert(!err, 'There is an error', err, colleges);
			console.assert(typeof colleges === 'object', 'Unexpected "colleges" type', typeof colleges);

			done();
		});
	},

	function(done) {

		console.log('Testing .subjects');

		BU_API.subjects('CAS', function(err, subjects){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof subjects === 'object', 'Unexpected "subjects" type', typeof subjects);

			done();
		});
	},

	function(done) {

		console.log('Testing .departments');

		BU_API.departments('CAS', function(err, departments){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof departments === 'object', 'Unexpected "departments" type', typeof departments);

			done();
		});
	},

	function(done) {

		console.log('Testing .courses');

		BU_API.courses('CAS', 'CS', function(err, courses){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof courses === 'object', 'Unexpected "courses" type', typeof courses);

			done();
		});
	},

	function(done) {

		console.log('Testing .bulletin');

		BU_API.bulletin(function(err, colDep){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof colDep === 'object', 'Unexpected "colDep" type', typeof colDep);

			done();
		});

	},

	function(done) {

		console.log('Testing .xCollegeDep');

		BU_API.xCollegeDep(function(err, colDep){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof colDep === 'object', 'Unexpected "colDep" type', typeof colDep);

			done();
		});
	},

	function(done) {

		console.log('Testing .sections');

		BU_API.sections('CAS', 'CS', '111', function(err, sections){
			console.assert(!err, 'There is an error', err);
			console.assert(typeof sections === 'object', 'Unexpected "sections" type', typeof sections);

			done();
		});
	},

	function(done) {

		console.log('Testing .seats');

		BU_API.seats('2015FALLCASCS111 A1', function(seats){
			console.assert(seats === null || typeof seats === 'number');

			done();
		});
	},

], function (err, result) {

	console.log('Done Testing');

	process.exit();
});