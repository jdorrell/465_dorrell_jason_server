require('dotenv').config();

const timestamp = require('unix-timestamp'),
    JsonDb = require('node-json-db');

module.exports.store = function (msg) {

    var db = new JsonDb(process.env.INBOX, true, true),
        msgID = "/" + timestamp.now();
        
    //db.push(msgID, { test: "test", json: { test: ["test"] } });//keep for sample
    db.push(msgID, { From: msg.email_user, To: [msg.email_recipient, "test2"], Subject: msg.email_subject, Body: msg.email_body});

    console.log("record added".blue);
};