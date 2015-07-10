var fs = require("fs"),
http = require("http"),
mongoose = require("mongoose"),
jade = require('jade');

// load Car model
var carAttrs = require("./car.js"),
carSchema = mongoose.Schema(carAttrs);


var Car = mongoose.model('Car', carSchema);
mongoose.connect('mongodb://localhost/crud_sans_frameworks');

var handleRequest = function(req, res) {
 // redirect users to /cars if they try to hit the homepage
 if (req.url == '/') {
   res.writeHead(301, {Location: 'http://localhost:1337/cars'})
   res.end();
 }//root path redirecting to cars



 if (req.url === '/cars' && req.method === 'GET') {//INDEX GET
   var index = fs.readFileSync('index.jade', 'utf8');
   compiledIndex = jade.compile(index, { pretty: true, filename: 'index.jade' });
   Car.find(function (err, cars) {
     if (err) { return console.error(err); }
     var rendered = compiledIndex({cars: cars});
     res.end(rendered);
   });



 } else if (req.url === '/cars' && req.method === 'POST') {//INDEX POST
   req.on('data', function(data) {
    var tempdata = data.toString().split('&');
    tempdata.pop();
    var temperdata = tempdata.map(function(param) {
      return param.replace('car%5B', '');
    })
    var params = {}
    temperdata.forEach(function(param) {
      params[param.split('%5D=')[0]] = param.split('%5D=')[1].replace(/\+/g, ' ');
    });
    params.year = Number(params.year)
    var car = new Car(params);
    car.save(function(err) {
      if (err) return console.error(err);
    })
    res.writeHead(301, {Location: 'http://localhost:1337/cars'})
    res.end();
   });



 } else if (req.url === '/cars/new') {//NEW
     var newCar = fs.readFileSync('new.jade', 'utf8');
     compiledNew = jade.compile(newCar, { pretty: true, filename: 'new.jade' });
     var rendered = compiledNew();
     res.end(rendered);

 } else {
   res.writeHead(200);
   res.end('A new programming journey awaits');
 }
};

var server = http.createServer(handleRequest);
server.listen(1337);
