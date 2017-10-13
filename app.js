require('dotenv').config();

const tls = require('tls'),
    fs = require('fs'),
    colors = require('colors'),
    db = require('./store_message.js');

//var msg;      //keep for now
var msg_status = {

    welcome: false,
    hello: false,
    from_OK: false,
    to_OK: false,
    begin_msg: false,
    server_send: false,
    body_ok: false,


};

var options = {
    key: fs.readFileSync(process.env.KEY),
    cert: fs.readFileSync(process.env.CERT),

    // This is necessary only if using the client certificate authentication.
    // Without this some clients don't bother sending certificates at all, some do
    requestCert: true,

    // Do we reject anyone who certs who haven't been signed by our recognised certificate authorities
    rejectUnauthorized: true,

    // This is necessary only if the client uses the self-signed certificate and you care about implicit authorization
    ca: [fs.readFileSync(process.env.CA)]
};

var server = tls.createServer(options, function (socket) {

    socket.setEncoding('utf8');
	
    if (socket.authorized) {
        socket.write(process.env.SERVER_WELCOME);
        msg_status.welcome = true;
        //console.log('new')//for testing
    };

    socket.on('data', function (req) {
        //console.log(req);//for testing
        

        if (socket.authorized) {

            if (req !== "ERROR") {

                console.log(req.green);

                if (req === process.env.CLIENT_HELO && msg_status.welcome) {

                    socket.write(process.env.SERVER_HELLO);
                    msg_status.hello = true;

                };

                if (req.startsWith(process.env.MAIL_FROM) && msg_status.welcome && msg_status.hello) {

                    socket.write(process.env.SERVER_OK);
                    //msg = req;    //keep for now
                    msg_status.from_OK = true;

                };

                if (req.startsWith(process.env.RCPT_TO) && msg_status.welcome && msg_status.hello && msg_status.from_OK) {

                    socket.write(process.env.SERVER_OK);
                    //msg = msg + req;    //keep for now
                    msg_status.to_OK = true;

                };
     
                if (req === process.env.DATA && msg_status.welcome && msg_status.hello && msg_status.from_OK && msg_status.to_OK) {

                    socket.write(process.env.SERVER_SEND);
                    msg_status.server_send = true;
                    
                };

                if (req !== process.env.DATA && msg_status.welcome && msg_status.hello && msg_status.from_OK && msg_status.to_OK && msg_status.server_send) {

                    msg_status.begin_msg = true;

                };

                if (req.startsWith('{') && msg_status.welcome && msg_status.hello && msg_status.from_OK && msg_status.to_OK && msg_status.server_send && msg_status.begin_msg) {

                    //msg = msg + req;    //keep for now
                    //console.log(req); //for testing
                    var msg = JSON.parse(req);
                    db.store(msg);
                    msg_status.body_ok = true;

                };

                if (req === '\r\n' + process.env.CLIENT_END + '\r\n') {

                    socket.write(process.env.SERVER_OK + ", " + process.env.SERVER_ACCEPTS);

                };

                if (req === process.env.QUIT) {

                    socket.write(process.env.SERVER_GOODBYE);

                };
            };

        };

        //db.store(JSON.parse(req));
	});

    /////////////////////////////////////////////////
    //socket closed from client side throws exception
	socket.on('end', function() {
        socket.destroy();
        console.log("socket destroyed".blue);
    });
    /////////////////////////////////////////////////
	
});

server.listen(9999, function (socket) {
    console.log('server bound'.blue);

});

//db.store(msg);
