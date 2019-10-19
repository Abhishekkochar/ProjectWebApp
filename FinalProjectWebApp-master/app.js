const http = require("http");
const routes = require('./routes');
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const port = 8081;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const passport = require("passport");
const config = require("./Config/database");
const ejs = require("ejs");
const multer = require("multer");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require("express-session");
const ejsLint = require('ejs-lint');

// Passport config
require('./Config/passport-setup')(passport)
app.use(passport.initialize());
app.use(passport.session());
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }),
    function(req,res,next)
    {
        res.locals.session = req.session;
        next();
    }
    
  );
app.use(flash());

  
  
// Express Validator Middleware
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

    while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
    }
    return {
    param : formParam,
    msg   : msg,
    value : value
    };
}
}));
//setting ejs
app.set('view engine', 'ejs');
//database connection
mongoose.connect(config.database, {
    useNewUrlParser: true
});
let db = mongoose.connection;

db.once('open', function(){
    console.log('connected to mongo db')
});
db.on('error', function(err){
    console.log(err);
});
routes(app);
app.use(express.static(__dirname + '/Public'));



var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('listening at port ', host, port)

module.exports = app;
})