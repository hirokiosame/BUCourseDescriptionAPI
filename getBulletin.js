module.exports = (function(){

	// Get available colleges from API
	// More reliable since bulletin includes: MED, SDM, OTP, UHC, UNI, XAS, XRG

	var get = require("./get"),
		async = require("async"),
		cheerio = require("cheerio");


	function parseDepartment($, dt, cb){
		var $dt = $(dt),
			depCode = $dt.text().trim();

		if( depCode.length !== 2 ){ return cb(); }

		cb(null, {
			depCode: depCode,
			depName: $dt.next().text().trim()
		});
	}

	function parseCollege($, dt, cb){

		var $dt = $(dt), $dd = $dt.next("dd");

		// Add to colleges
		var college = {
			collegeCode: $dt.text().trim(),
			collegeName: $dd[0].children[0].data.trim()
		};

		// Each Department
		async.mapSeries(
			[].slice.apply($dd.children("dl").find("dt")),
			parseDepartment.bind(null, $),
			function(err, results){
				if( err ){ cb(err); return; }

				college.departments = results;

				cb(null, college);
			}
		);
	}

	return function bulletin(cb){
		get.http("http://www.bu.edu/academics/bulletin/abbreviations-and-symbols/", function(err, body){

			if( err ){ cb(err); return; }

			var $ = cheerio.load(body);

			// Each College
			async.mapSeries(
				[].slice.apply($("dl.tabular").eq(3).children("dt")),
				parseCollege.bind(null, $),
				cb
			);
		});
	};
})();