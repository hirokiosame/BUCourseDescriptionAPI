# BUCourseDescriptionAPI

BUCourseDescriptionAPI is a Node.js module that makes it easy to query course information from the bu.edu website.

## Installation
```sh
$ npm install --save hirokiosame/BUCourseDescriptionAPI
```


## API
```js
var BU_API = require('BUCourseDescriptionAPI');

# From the mobile API
BU_API.colleges(function(err, colleges){});

# From the mobile API
BU_API.subjects('CAS', function(err, subjects){});

# From the mobile API
BU_API.departments('CAS', function(err, departments){});

# From the mobile API
BU_API.courses('CAS', 'CS', function(err, courses){});

# Parses and fetches from http://www.bu.edu/academics/bulletin/abbreviations-and-symbols/
BU_API.bulletin(function(err, colDep){});

# Cross references the mobile API and bulletin since the mobile API is outdated
BU_API.xCollegeDep(function(err, colDep){});

# From http://www.bu.edu/phpbin/course-search/section/
BU_API.sections('CAS', 'CS', '111', function(err, sections){});

# From the mobile API
BU_API.seats('2015FALLCASCS111 A1', function(seats){});
```


## Testing

```sh
node ./test.js
```


## Disclaimer
Use at your own risk. I'm not to be held responsible in any way for any actions/damages caused by using this API module.


## License
The MIT License (MIT)

Copyright (c) 2015 Hiroki Osame <hiroki.osame@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.