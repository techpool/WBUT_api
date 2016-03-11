var express = require('express');
var app = express();
var async = require('async');
var fs = require('fs');

var http = require('http');
var querystring = require('querystring');


var rectype = 1;

var semno = 4;
var rollno = 25300113047;

async.forever(
    function(foreverCallBack) {

        async.waterfall([
            function(callback) {
                var postData = querystring.stringify({
                    'semno': semno,
                    'rectype': rectype,
                    'rollno': rollno
                });

                var options = {
                    hostname: 'www.wbutech.net',
                    port: 80,
                    path: '/show-result.php',
                    method: 'POST',
                    headers: {
                        'Host': 'www.wbutech.net',
                        'Connection': 'keep-alive',
                        'Cache-Control': 'max-age=0',
                        'Content-Length': '36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Origin': 'http://www.wbutech.net',
                        'Upgrade-Insecure-Requests': '1',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'http://www.wbutech.net/result_even.php',
                        'Accept-Encoding': 'gzip, deflate',
                        'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.6'
                    }
                };

                var req = http.request(options, (res) => {
                    if (res.statusCode == 200) {
                        console.log(`STATUS: ${res.statusCode}`);
                        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                        res.setEncoding('utf8');
                        var data = '';
                        res.on('data', function(chunk) {
                            data += chunk
                        });
                        res.on('end', () => {
                            var fileName = rollno + '_semno' + semno + '.html';
                            fs.writeFile(fileName, data, function(err) {
                                if (err) {
                                    console.log('Error writing file: ' + err);
                                } else {
                                    console.log('Data written to file: ' + fileName + ' successfully!');
                                }
                            })
                            console.log('No more data in response.')
                        })
                    } else {
                        console.log('here')
                        foreverCallBack(null);
                    }
                });

                req.on('socket', function (socket) {
                    socket.setTimeout(3000);  
                    socket.on('timeout', function() {
                        req.abort();
                    });
                });

                req.on('error', (e) => {
                    console.log(e)
                    console.log(`problem with request: ${e.message}`);
                    foreverCallBack(null);
                });

                req.write(postData);
                req.end();
            }
        ], function(err) {
            console.log(err);
        })
    },
    function(err) {
        console.log(err);
    }
);


app.get('/', function(request, response) {
    response.send('Hey There!');
});

app.listen(4000, function(err) {
    console.log("Server is listening on: 4000 port");
});