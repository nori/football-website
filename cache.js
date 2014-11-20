var fs = require('fs');
var http = require('http');

var cache = {
    directory: "cache/",
    cacheDuration: 60*60*1000, // one hour

    // gets the data from key and calling callback with data
    get: function(key, url, callback) {
        var filepath = this.directory + key;
        var self = this;
        fs.stat(filepath, function(err, stats) {
            if (err) {
                self.download(key, url, callback);
                return;
            }

            var now = new Date();
            if (new Date(now.getTime() - this.cacheDuration) > stats.mtime) {
                console.log("Old data");
                self.download(key, url, callback);
                return;
            }

            fs.readFile(filepath, function(err, data) {
                if (err) {
                    callback(err);
                }

                callback(null, data);
            });
        });
    },

    // downloads file, saves at key and calls get again
    download: function(key, url, callback) {
        var filepath = this.directory + key;
        var file = fs.createWriteStream(filepath);
        var self = this;
        var request = http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        self.get(key, url, callback);
                    }
                });
            });
        }).on('error', function(err) {
            callback(err);
        });
    }
};

module.exports = cache;
