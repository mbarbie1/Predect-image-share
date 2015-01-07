var express = require('express');
//var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');
var router = express.Router();
//var base = process.env.PWD;
var base = path.resolve('.');
var uploadImageFolder = path.join( base, './data/images/original');
var uploadDataFolder = path.join( base, './data');

// route middleware that will happen on every request: here we log the requests happening
router.use(function(req, res, next) {
	console.log('happens on every request: ');

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();	
});

/* GET home page. */
router.get('/', function(req, res) {
	console.log('GET /');
	res.render('index', { title: 'Express' });
});

/* GET image download file. */
router.get('/download', function(req, res) {
	console.log('GET /download');
	var file = path.join( uploadImageFolder, req.query.file );
	res.download(file);
});

/* USE image download file. */
router.use('/data', function(req, res, next) {
	console.log('USE /data/');
	console.log('  The url = %j', req.url);
	var file = path.join( base, 'data/' + req.url );
	if ( !fs.lstatSync( file ).isDirectory()  ) {
		console.log('Downloading: ', file);
		res.download(file);
	} else {
		console.log('Not a file (serve-index will handle it): ', file);
		next();
	}
});

/* GET list files in image directory. */
/* router.get('/listFiles', function(req, res) {
	//	var file = path.join( uploadImageFolder, req.query.file );
	//	res.download(file); // Set disposition and send it.

	// WATCH THE UPLOAD DIRECTORY FOR CHANGES
	fs.watch('somedir', function (event, filename) {
	  console.log('event is: ' + event);
	  if (filename) {
		console.log('filename provided: ' + filename);
	  } else {
		console.log('filename not provided');
	  }
	});
}); */

/* POST file to upload page. */
router.post('/upload', function(req, res){
	console.log('POST /upload');

    var fstream;
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		console.log('file event');
		console.log('fieldname');
		console.log(fieldname);
		console.log('file');
		console.log(file);
		console.log('filename');
		console.log(filename);
		console.log('encoding');
		console.log(encoding);
		console.log('mimetype');
		console.log(mimetype);
		fstream = fs.createWriteStream( path.join(uploadImageFolder, filename) );
		file.pipe(fstream);
		fstream.on('close', function () {
			res.redirect('back');
		});
    });

    req.pipe(req.busboy);
});

module.exports = router;
