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
  }

  if (req.url == '/cars') {
    // Synchronously load the index jade template (http://jade-lang.com/)
    var index = fs.readFileSync('index.jade', 'utf8');
    // Compile template
    compiledIndex = jade.compile(index, { pretty: true, filename: 'index.jade' });

    // example of data that can be passed in to the Jade template:
    // in your CRUD app, a call to Mongoose should return all of the Cars
    var sampleDataForCars = { cars: [
      { driver: 'Andreas', make: 'Nissan', model: 'Xterra', year: 2005 },
      { driver: 'Bob Ross', make: 'Ford', model: 'Pinto', year: 1972 }
    ]};

    // Render jade template, passing in the info
    var rendered = compiledIndex(sampleDataForCars);

    // Write rendered contents to response stream
    res.end(rendered);
  } else {
    // Your code might go here (or it might not)
    res.writeHead(200);
    res.end('A new programming journey awaits');
  }
};

var server = http.createServer(handleRequest);
server.listen(1337);
