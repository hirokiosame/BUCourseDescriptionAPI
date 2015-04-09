module.exports = (function(){

	'use strict';

	var get = require("./get"),
		async = require("async");

	return {
		colleges: function (cb){
			if( typeof cb !== "function" ){ throw new Error("Callback must be passed in"); }

			get.JSON("http://www.bu.edu/bumobile/rpc/courses/colleges.json.php", cb);
		},

		subjects: function(collegeCode, cb){
			if( typeof cb !== "function" ){ throw new Error("Callback must be passed in"); }
			if( typeof collegeCode !== "string" ){ cb(new Error("College code must be a string")); return; }

			get.JSON("http://www.bu.edu/bumobile/rpc/courses/subjects.json.php", { q: collegeCode }, cb);
		},

		departments: function(collegeCode, cb){
			if( typeof cb !== "function" ){ throw new Error("Callback must be passed in"); }
			if( typeof collegeCode !== "string" ){ cb(new Error("College code must be a string")); return; }

			get.JSON("http://www.bu.edu/bumobile/rpc/courses/departments.json.php", { q: collegeCode }, cb);
		},

		courses: function(collegeCode, depCode, cb){
			if( typeof cb !== "function" ){ throw new Error("Callback must be passed in"); }
			if( typeof collegeCode !== "string" ){ cb(new Error("College code must be a string")); return; }
			if( typeof depCode !== "string" ){ cb(new Error("Department code must be a string")); return; }

			get.JSON("http://www.bu.edu/bumobile/rpc/courses/courses.json.php", { college: collegeCode, departments: depCode }, cb);
		},

		bulletin: require("./getBulletin"),

		xCollegeDep: function(cb){

			var self = this;

			this.bulletin(function(err, bResult){
				if( err ){ cb(err); return; }

				var _bResult = {};
				bResult.forEach(function(c){
					_bResult[c.collegeCode] = c;
				});

				self.colleges(function(err, cResult){
					if( err ){ cb(err); return; }

					var colleges = {};
					cResult.ResultSet.Result.forEach(function(col){

						var cc = col.college_code;

						if( !_bResult[cc].departments.length ){
							var CC = _bResult[cc].collegeName.match(/[A-Z]{3}/);

							if( CC ){
								_bResult[cc].departments = _bResult[CC[0]].departments;	
							}
						}

						colleges[cc] = _bResult[cc];
						colleges[cc].collegeName = col.college_name;
					});

					cb(null, colleges);
				});
			});
		},

		sections: require("./getSections")
	};
})();