module.exports = (function(){

	'use strict';

	var get = require("./get"),
		async = require("async"),
		cheerio = require("cheerio");


	var queue = {},
		interval;


	function getOpenSeats(){

		var _queue = queue;

		queue = {};

		get.JSON(
			"http://www.bu.edu/phpbin/summer/rpc/openseats.php",
			{ "sections[]": Object.keys(_queue) },
			function(err, res){

				if( err ){ cb(err); return; }

				var seats = res.results;

				for( var key in _queue ){
					_queue[key]( seats.hasOwnProperty(key) ? +seats[key] : null );
				}
			}
		);
	}

	return function getSeats(seatsKey, cb) {

		if( queue.hasOwnProperty(seatsKey) ){
			throw new Error("Duplicate request for " + seatsKey);
		}

		queue[seatsKey] = cb;

		if( !interval ){
			interval = setInterval(getOpenSeats, 200);
		}
	};
})();