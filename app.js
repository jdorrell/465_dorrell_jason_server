require('dotenv').config();

const tls = require('tls'),
    fs = require('fs'),
    db = require('./store_message.js'),
    msg = require('./message.json');

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

    	//Show the certificate info as supplied by the client
    	//console.log(socket.getPeerCertificate());

    	console.log('server connected',	socket.authorized ? 'authorized' : 'unauthorized');
    	
    	socket.setEncoding('utf8');
    		
	socket.on('data', function(data){
		console.log(data);
		console.log(socket.address());
        socket.write(data);
        db.store(JSON.parse(data));

	});

	socket.on('end', function() {
  		socket.destroy();
	});
	
});

server.listen(9999, function (socket) {
	console.log('server bound(step1)');
	
});

//db.store(msg);
