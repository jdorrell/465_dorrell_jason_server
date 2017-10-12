require('dotenv').config();

const tls = require('tls'),
    fs = require('fs');
    //db = require('./store_message.js'),
    //msg = require('./message.json');

var handshakeComplete = false;

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
        //console.log('new')//for testing
    };

    socket.on('data', function (req) {
        //console.log(req);//for testing
        if (socket.authorized) {

            if (req !== "ERROR") {

                console.log(req);

                if (req === process.env.CLIENT_HELO) {

                    socket.write(process.env.SERVER_HELLO);

                };

                if (req.startsWith(process.env.MAIL_FROM)) {

                    socket.write(process.env.SERVER_OK);

                };

                if (req.startsWith(process.env.RCPT_TO)) {

                    socket.write(process.env.SERVER_OK);

                };

                if (req === process.env.DATA) {

                    socket.write(process.env.SERVER_SEND);

                };

                if (req === "Way to go dumbass!") {//need to verify msg body

                    console.log('message recieved');

                };

                if (req === '\r\n' + process.env.CLIENT_END + '\r\n') {

                    socket.write(process.env.SERVER_OK + ", " + process.env.SERVER_ACCEPTS);

                };

                if (req === process.env.QUIT) {

                    socket.write(process.env.SERVER_GOODBYE);

                };//good to this line
            };
        };

        //db.store(JSON.parse(req));
	});

    /////////////////////////////////////////////////
    //socket closed from client side throws exception
	socket.on('end', function() {
        socket.destroy();
        console.log("socket destroyed");
    });
    /////////////////////////////////////////////////
	
});

server.listen(9999, function (socket) {
    console.log('server bound');

});

//db.store(msg);
