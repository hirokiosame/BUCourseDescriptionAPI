module.exports = (function(){

	var get = require("./get"),
		async = require("async"),
		cheerio = require("cheerio");


	// Create patterns for td matching
	var tdPattern = "", depPattern = "";
	for(var i = 0; i<8; i++){
		tdPattern += "\<td.*?\>(.*?)\<\/td\>";
		if( i < 4 ){
			depPattern += "\<td.*?\>(.*?)\<\/td\>";
		}
	}
	tdPattern = new RegExp(tdPattern);
	depPattern = new RegExp(depPattern);


	function getOpenSeats(sectionsObj, cb){
		get.JSON(
			"http://www.bu.edu/phpbin/summer/rpc/openseats.php",
			{ "sections[]": Object.keys(sectionsObj) },
			function(err, res){

				if( err ){ cb(err); return; }

				var seats = res.results,
					sections = [];

				for( var key in sectionsObj ){

					sectionsObj[key].openSeats = seats[key] ? +seats[key] : null;

					sections.push(sectionsObj[key]);
				}

				// Return result
				cb(null, sections);
			}
		);
	}

	function parseTime(time, pm){

		time = time.split(":");

		var mins = time[0]*60 + +time[1];

		if( pm === "pm" && time[0] !== "12" ){
			mins += 60*12;
		}

		return mins;
	}

	function parseSchedule(type, loc, time){
		var sched = {
			type: type.trim()
		};

		if( (loc = loc.trim()).length > 1 ){
			var _loc = loc.split(" ");
			if( _loc.length === 2 ){
				sched.location = {
					building: _loc[0],
					room: _loc[1]
				};
			}else{ sched.location = loc; }	
		}

		var _time = time.split(/[\s\-]/);

		if( _time.length === 5 ){
			sched.days = _time[0].split("");
			sched.start = parseTime(_time[1], _time[2]);
			sched.end = parseTime(_time[3], _time[4]);
		}

		if( Object.keys(sched).length !== 0 ){
			return sched;
		}
	}

	function parseRow(sem, $, tr, cb){

		var $tr = $(tr),
			seatsKey = tr.attribs["data-section"];

		var html = $tr.html();

		var trMatch = html.match(tdPattern);

		if( !trMatch ){ return; }

		var section = {
			semester: sem,
			section: trMatch[1].trim(),
			instructor: trMatch[3].trim() || null,
			schedule: [],
			seatsKey: seatsKey,
			notes: trMatch[8].trim() || null
		};

		var parsedSched = parseSchedule(trMatch[4], trMatch[5], trMatch[6]);
		if( parsedSched ){ section.schedule.push(parsedSched); }

		// Check for dependent sections
		while( (tr = tr.next) && !tr.attribs["data-section"] ){
			var match = $(tr).html().match(depPattern);

			if( match ){
				if( parsedSched = parseSchedule(match[1] || trMatch[4], match[2], match[3]) ){
					section.schedule.push(parsedSched);
				}
			}
		}

		if( this[seatsKey] ){
			cb(new Error("Duplicate seatsKey"));
		}else{

			this[seatsKey] = section;
			cb(null);
		}
	}

	function parseSemester($, sem, nextSem){
		var $sem = $(sem),
			semester = $sem.text().trim();

		// Parse table
		async.each(
			[].slice.apply($sem.next("table").find("tr[data-section]")),
			parseRow.bind(this, semester, $),
			nextSem
		);
	}


	return function(collegeCode, depCode, courseNum, cb){
		get.http(
			"http://www.bu.edu/phpbin/course-search/section/",
			{ t: collegeCode + depCode + courseNum },
			function(err, body){

				if( err ){ cb(err); return; }

				var $ = cheerio.load(body);

				var semesters = [].slice.apply($("h3"));

				if( semesters.length === 0 ){ cb(new Error("Course doesn't exist")); return;}

				var sections = {};

				// Parse each semester
				async.each(
					semesters,
					parseSemester.bind(sections, $),
					function(err){
						if( err ){ throw err; }

						getOpenSeats(sections, cb);
					}
				);
			}
		);
	};
})()