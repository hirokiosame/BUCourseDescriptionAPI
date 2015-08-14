var API = require("./BUAPI");

API.colleges(function(err, colleges){
	console.assert(!err, "There is an error", err, colleges);
	console.assert(typeof colleges === "object", "Unexpected 'colleges' type", typeof colleges);
});

API.subjects("CAS", function(err, subjects){
	console.assert(!err, "There is an error", err);
	console.assert(typeof subjects === "object", "Unexpected 'subjects' type", typeof subjects);
});

API.departments("CAS", function(err, departments){
	console.assert(!err, "There is an error", err);
	console.assert(typeof departments === "object", "Unexpected 'departments' type", typeof departments);
});

API.courses("CAS", "CS", function(err, courses){
	console.assert(!err, "There is an error", err);
	console.assert(typeof courses === "object", "Unexpected 'courses' type", typeof courses);
});

API.bulletin(function(err, colDep){
	console.assert(!err, "There is an error", err);
	console.assert(typeof colDep === "object", "Unexpected 'colDep' type", typeof colDep);
});

API.xCollegeDep(function(err, colDep){
	console.assert(!err, "There is an error", err);
	console.assert(typeof colDep === "object", "Unexpected 'colDep' type", typeof colDep);
});

API.sections("CAS", "CS", "111", function(err, sections){
	console.assert(!err, "There is an error", err);
	console.assert(typeof sections === "object", "Unexpected 'sections' type", typeof sections);
});

// API.sections("CAS", "NE", "101", function(err, sections){
// 	console.log(JSON.stringify(sections, 0, 4));
// });

API.sections("MET", "AT", "602", function(err, sections){
	console.assert(!err, "There is an error", err);
	console.assert(typeof sections === "object", "Unexpected 'sections' type", typeof sections);
	console.log(JSON.stringify(sections, 0, 4));
});

API.sections("MET", "AT", "602", function(err, sections){
	console.assert(!err, "There is an error", err);
	console.assert(typeof sections === "object", "Unexpected 'sections' type", typeof sections);
	console.log(JSON.stringify(sections, 0, 4));
});


API.seats("2015FALLCASCS111 A1", function(seats){
	console.assert(seats === null || typeof seats === "number");
});