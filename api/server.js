/**
 * Created by prandutt on 8/13/2014.
 */

var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var cors = require('express-cors');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(cors({
    allowedOrigins: [
        'localhost:8081',
        'localhost:8080'


    ]
}));
var port = process.env.PORT || 8084; 		// set our port

// ROUTES FOR OUR API

var router = express.Router(); 				// get an instance of the express Router

router.post('/logData', function (req, res) {
    console.log('log data posted:'+req.body.message)
    return res.send(200,"Post accepted");
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER

app.listen(port);
console.log('Server started !!')