const express = require('express');
const path = require('path')
const key = require('./config/main');
const {port, mongoURL} = key;
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const app = express();
const routes = require('./routes');
const db = require('./config/db');
const session = require('express-session');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const SocketService = require('./app/middleware/SocketService');
const { Socket } = require('dgram');
db(mongoURL);


global._io = io

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000000 }
})

app.use(sessionMiddleware)

// app.use(morgan('combined'));
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
    condition: (a, b, options) => {
      if (a == b) return options.fn(this)
      return options.inverse(this)
    },
    ifEquals: (arr, index, options) => {
      return (arr[index]) ? options.fn(this) : options.inverse(this)
    },
    PlusOne: (number) =>{
      return parseInt(number) + 1
    }
  }
}));
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resouces/views'));

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

global._io.on('connection', SocketService.connection)

routes(app);

server.listen(port, () => {
  console.log('listening on *:' + port);
});