require('dotenv').config();

const timestamp = require('unix-timestamp'),
    JsonDb = require('node-json-db');

module.exports.store = function (msg) {

    var db = new JsonDb(process.env.INBOX, true, true),
        msgID = "/" + timestamp.now();
        
    //db.push(msgID, { test: "test", json: { test: ["test"] } });//keep for sample
    db.push(msgID, { From: msg.From, To: [msg.To], Subject: msg.Subject, Body: msg.Body});

    console.log("record added".blue);
};