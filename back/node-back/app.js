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

let usersRouter = require('./routes/users');
let menuRouter = require('./routes/menu');
let dishesRouter = require('./routes/dishes');
let ordersRouter = require('./routes/orders');
let tablesRouter = require('./routes/tables');

// prova post auth
let postsRouter = require('./routes/posts');

var app = express();

// socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);


// prova
let ex = require('./prova.js');
ex.f();

// FOR CONNECTION SEE VIDEO .env
// import mongoose for connection
let mongoose = require('mongoose');
// connessione mongoose in local host
console.log("DB URL:", process.env.DB_CONNECT);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
  if (err) {
    console.error("error connecting to DB:", err);
  } else {
    console.log("connected to DB");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('socketio', io);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', function (socket) {
  console.log('a user connected');
  /*socket.on('message', function(msg){ // listen
    console.log(msg);
    io.emit('message', msg); // broadcast to all
  });*/
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

app.use(function (req, res, next) {
  res.io = io;
  next();
});

app.use('/', indexRouter);
//app.use('/users', usersRouter);
// my use routes

app.use('/auth', authRouter);

app.use('/users', usersRouter);
app.use('/menu', menuRouter);
app.use('/dishes', dishesRouter);
app.use('/orders', ordersRouter);
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

module.exports = { app: app, server: server };
