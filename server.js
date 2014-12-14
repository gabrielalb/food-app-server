var express = require('express');
var app = express();
var url = require('url');
var bodyParser = require('body-parser');
var Spreadsheet = require('edit-google-spreadsheet');
//var http = require('http');

//config 
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
//app.use(express.methodOverride());
//app.use(express.static(path.join(application_root, "public")));
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.use(function(req, res, next) {
	// CORS
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); 
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

var router = express.Router();
app.use('/foodapi', router);

router.post('/doc/:docID/worksheet/:worksheetID/cells', function(req, res) {
	var urlData = url.parse(req.url, true);

	var cellData = {};
	var cellColData = {};
	cellColData[req.body.col] = req.body.inputValue;
	cellData[req.body.row] = cellColData;

	Spreadsheet.load({
	  debug: true,
	  accessToken : {
      	type: 'Bearer',
      	token: urlData.query.access_token
      },
	  spreadsheetId: req.params.docID,
	  worksheetId: req.params.worksheetID
	}, function run(err, spreadsheet) {
	  if(err) {
	  	return res.send(500, { message: "Error while publishing!", type: "error" });
	  }
	  spreadsheet.add(cellData);

	  spreadsheet.send(function(err) {
	    if(err) {
	  		return res.send(500, { message: "Error while publishing!", type: "error" });
	    }

	    res.json({ message: "Publish successful!", type: "success" });
	  });
	});
});

app.listen(process.argv[2] ? process.argv[2] : 8080);