var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var fs = require('fs');
var serveIndex = require('serve-index');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');
app.set('strict routing', true);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
//app.use( busboy( { immediate: true } ) ); 
app.use( busboy( { immediate: false } ) ); 

// ROUTE DEFINITIONS
//
//
app.use('/', routes);

// Dirty hack to serve pages which start with a random url starting with 'data/' and containing /public/: Chop of the first part before '/public/'
app.use( '/data/', function(req, res, next) {
	console.log('This is a /data/ request: ');
	if (req.url.match(/\/public/g)) {
		res.send();
		console.log('This is a /data/ request: ');
	} else
		// continue doing what we were doing and go to the route
		next();
	}	
	// log each request to the console
	console.log(req.method, req.url);


});// Serve URLs like /ftp/thing as public/ftp/thing
app.use( '/data/', serveIndex('./data', {'icons': true, 'view': 'details','stylesheet':'./public/stylesheets/serve-index.css', 'template':'./public/dataManagerTemplate.html' } ) );



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
