var express=require('express');
var bodyParser = require('body-parser');
var path=require('path');
var app=express();
var fs = require('fs');
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
process.env['port'] = 3000;

var port= process.env['port'] ;
var http = require('http');

http.createServer(app).listen(port, function() {
    console.log('Farshad  listening on port'+port+ '!');
    console.log("client needs a rpc call at time:"+new Date());
});

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

amqp.connect('amqp://localhost:5673', function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertQueue('', {exclusive: true}, function(err, q) {
            var corr = generateUuid();
            var num = parseInt(args[0]);

            console.log(' [x] Requesting fib(%d)', num);

            ch.consume(q.queue, function(msg) {
                if (msg.properties.correlationId == corr) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function() { conn.close(); process.exit(0) }, 500);
                }
            }, {noAck: false});//automatically acknowledges

            ch.sendToQueue('rpc_queue',
                new Buffer(num.toString()),
                { correlationId: corr, replyTo: q.queue });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

app.get('/',function(req,res) {
    res.end("test")
});



//*****************************************************************************
//*****************************************************************************
