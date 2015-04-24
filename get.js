module.exports = (function(){

	var http = require("http"),
		url = require("url"),
		qs = require("querystring");

	var zlib = require('zlib');


	var methods = {
		http: function(uri, params, cb){

			var args = [].slice.apply(arguments);

			if( args.length < 2 ){ throw new Error("Not enough arguments provided"); }
			
			// If not callback
			if( typeof (cb = args.pop()) !== "function" ){
				throw new Error("Callback not provided");
			}

			var _uri = url.parse(uri);
			if( params.constructor === Object ){
				_uri.path += "?" + qs.stringify(params);
			}

			http.get(
				{
					hostname: _uri.hostname,
					path: _uri.path,
					headers: {
						"Accept": "*/*",
						"Accept-Encoding": "gzip",
						"Cache-Control": "max-age=0",
						"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36"
					}
				},
				function(res){
					var _res;
					if( res.headers["content-encoding"] === "gzip" ){
						_res = zlib.createGunzip();
						res.pipe(_res);
					}else{ _res = res; }

					var output = "";
					_res.on("data", function(chunk){
						output += chunk;
					});

					_res.on("end", function(){ cb(null, output); });
				}
			).on("error", cb);
		},

		JSON: function(uri, params, cb){

			var args = [].slice.apply(arguments);

			if( args.length < 2 ){ throw new Error("Not enough arguments provided"); }
			
			// If not callback
			if( typeof (cb = args.pop()) !== "function" ){
				throw new Error("Callback not provided");
			}

			methods.http(uri, params, function(err, result){
				if( err ){ cb(err); }

				try{ result = JSON.parse(result); }
				catch(e){ cb(e, result); }

				if( typeof result === "object" ){ cb(null, result); }
			});
		}
	};

	return methods;
})();