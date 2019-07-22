var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// require and config dotenv
let dotenv = require('dotenv');

let cors = require('cors');

dotenv.config();

var indexRouter = require('./routes/index');
// myRoutes

let authRouter = require('./routes/auth');

let menuRouter = require('./routes/menu');
let dishesRouter = require('./routes/dishes');
let ordersRouter = require('./routes/orders');
let tablesRouter = require('./routes/tables');

// prova post auth
let postsRouter = require('./routes/posts');

var app = express();

// prova
let ex = require('./prova.js');
ex.f();

// FOR CONNECTION SEE VIDEO .env
// import mongoose for connection
let mongoose = require('mongoose');
// connessione mongoose in local host
mongoose.connect('mongodb://localhost:27017/Test', { useNewUrlParser: true });

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
// my use routes

app.use('/auth', authRouter);

app.use('/menu', menuRouter);
app.use('/dishes', dishesRouter);
app.use('/orders', ordersRouter),
app.use('/tables', tablesRouter);

// posts use
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
