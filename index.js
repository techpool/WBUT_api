var request = require('request');
var request = request.defaults({jar: true})
var express = require('express');
var app = express();
var zlib = require('zlib');
var async = require('async');
var fs = require('fs');

app.use(express.static('public'));

var rectype = 1;

var semno = 4;
var rollno = 25300113035;

var headerData = {};

var buffer = [];
var gunzip = zlib.createGunzip();



async.forever(
  function (foreverCallBack) {

      async.waterfall([
        function (callback) {
              request({
                  method: 'POST',
                  uri: 'http://www.wbutech.net/show-result_even.php',
                  headers:
                    {
                      'Host': 'www.wbutech.net',
                      'Connection': 'keep-alive',
                      'Cache-Control': 'max-age=0',
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                      'Origin': 'http://www.wbutech.net',
                      'Upgrade-Insecure-Requests': '1',
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Referer': 'http://www.wbutech.net/result_even.php',
                      'Accept-Encoding': 'gzip, deflate',
                      'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.6',
                    }
                  ,
                  body: 'semno='+ semno +'&rectype=' + rectype + '&rollno=' + rollno
              }, function (err, res, body) {
                  if (res.statusCode == 200) {
                      console.log("All on good track!");
                      callback(null);
                  } else {
                      console.log("Status Code: " + res.statusCode);
                      console.log("Refreshing! Please wait");
                      foreverCallBack(null);
                  }
              }).pipe(gunzip);;
        },
        function (callback) {
          gunzip.on('data', function(data) {
              buffer.push(data.toString())
          }).on("end", function() {
              // response and decompression complete, join the buffer and return
              buffer = buffer.join(" ");
              console.log("Done");
              callback(null);
          }).on("error", function(e) {
                foreverCallBack(e);
          });
        },
        function (callback) {
          var fileName = './public/results/' + rollno + '.html';
          fs.writeFile(fileName, buffer, function (err) {
            if (err) {
              console.log('Error writing file: ' + err);
            } else {
              console.log('Data written to file: ' + fileName + ' successfully!');
            }
          })
        }
      ], function (err) {
        console.log(err);
      })
  },
  function (err) {
    console.log(err);
    //forever loop error handling
  }
);


app.get('/', function (request, response) {
  response.send('Hey There!');
});

app.listen(4000, function (err) {
  console.log("Server is listening on: 4000 port");
});
