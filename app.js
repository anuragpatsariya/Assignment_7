/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var app = express();
app.use(bodyParser.json());
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/links_objects";


app.get("/links", function (req, res) {
    var collection;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("unable to connect to the server.", err);
        } else {
            console.log("Connected.");
            collection = db.collection("links_objects");
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        }
    });
});


app.post("/links", function (req, res) {
    var title = req.body.title;
    var link = req.body.link;
    var clicks = 0;
    var collection;
    var doc = { "title": title, "link": link, "clicks": clicks };
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unable to connect");
        } else {
            console.log("Connected for Insert.");
            collection = db.collection("links_objects");
            collection.insert(doc, { w: 1 }, function () {
                console.log("Record Added.");
                res.send("Record Added.");
            });
        }
    });
});

app.get("/click/:title", function (req, res) {
    var collection;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log("Unable to connect", err);
        } else {
            console.log("Connected for update.");
            collection = db.collection("links_objects");
            collection.findAndModify(
                { "title": req.params.title },
                [],
                { $inc: { clicks: 1 } },
                { new: true },
                function (err, doc) {
                    console.log("Record Updated.", doc);
                    console.log(doc.value.link);
                    res.redirect(doc.value.link);
                }
                );
        }
    });
});


// Create our Express-powered HTTP server
// and have it listen on port 3000
http.createServer(app).listen(3000);
