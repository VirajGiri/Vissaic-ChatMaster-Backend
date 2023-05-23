/**
 * Created by viraj on 20/6/2019.
 */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config/config');
var mongoose = require('mongoose');
var json2xls = require('json2xls');

var app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('connected to the databse');
    }
});

app.use(json2xls.middleware);
//set limit for request body-- This is added to send long data in request ex. base64 string for photo
app.use(bodyParser.json({limit: '10mb'}));




app.all('/*', function (req, res, next) {
    /*  if(req.get('Accept-Language')) {
          i18n.setLocale(req.get('Accept-Language'));
      }
      else
      {
          i18n.setLocale('en');//default to english
      }*/
    //console.log(req.get('Accept-Language'));
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,x-access-token');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(morgan('dev'));


app.use(bodyParser.json());// support json encoded bodies

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

//set limit for request body
app.use(bodyParser.json({limit: '50mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/master')(app, express);
app.use('/api',api);
// var registration = require('./app/routes/registrationApi')(app, express);
// app.use('/api/registrationApi',registration);
// var schoolBranch = require('./app/routes/schoolBranchApi')(app, express);
// app.use('/api/schoolBranchApi',schoolBranch);
// var payments = require('./app/routes/paymentsApi')(app, express);
// app.use('/api/paymentsApi',payments);


/*
app.get('*',function(req, res){

    res.sendFile(__dirname + '/public/app/view/home.html');
});
*/

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});






module.exports = app;


