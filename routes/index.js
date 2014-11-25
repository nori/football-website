var express = require('express');
var router = express.Router();

var cache = require('../cache');

var baseUrl = "http://www.football-data.org/";

router.get('/partials/:name', function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
});

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

router.get('/api/seasons/:id/ranking', function(req, res) {
	var id = req.params.id;
    var subUrl = "soccerseasons/" + id + "/ranking";
    cache.get('seasons' + id + 'ranking.json', baseUrl + subUrl, function(err, data) {
        if (err) {
            res.send("Villa: " + err);
        } else {
            res.send(data.toString());
        }
    });
});

router.get('/api/seasons/:id/fixtures', function(req, res) {
	var id = req.params.id;
    var subUrl = "soccerseasons/" + id + "/fixtures";
    cache.get('seasons' + id + 'fixtures.json', baseUrl + subUrl, function(err, data) {
        if (err) {
            res.send("Villa: " + err);
        } else {
            res.send(data.toString());
        }
    });
});

/* GET home page. */
router.get('*', function(req, res) {
	console.log("home page");
	res.render('index', { title: 'Express' });
});

module.exports = router;
