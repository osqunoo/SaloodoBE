var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var cors = require('cors');
var device = require('express-device');


var usersRouter = require('./routes/users');
var shipmentsRouter = require('./routes/shipments');


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.json({
  limit: '500mb'
}));

app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true,
  parameterLimit: 5000
}));

app.use(cors());
app.use(session({
  secret: '5648e34$%%',
  cookie: {
    maxAge: 60000
  },
  resave: true,
  saveUninitialized: true
}));
app.use(device.capture());

app.use('/api/users', usersRouter);
app.use('/api/shipments', shipmentsRouter);

app.all('/*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;