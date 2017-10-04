require('dotenv').config();

const timestamp = require('unix-timestamp'),
    JsonDb = require('node-json-db');

module.exports.store = function (msg) {

    var db = new JsonDb(process.env.INBOX, true, true),
        msgID = "/" + timestamp.now();

    db.push(msgID, msg);
    console.log(msgID);


    console.log("record added");
};