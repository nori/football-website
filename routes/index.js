var express = require('express');
var router = express.Router();

var cache = require('../cache');

var baseUrl = "http://www.football-data.org/";

router.get('/api/seasons', function(req, res) {
    var subUrl = "soccerseasons";
    cache.get('seasons.json', baseUrl + subUrl, function(err, data) {
        if (err) {
            res.send("Villa: " + err);
        } else {
            res.send(data.toString());
        }
    });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
