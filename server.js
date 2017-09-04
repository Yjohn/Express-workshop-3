const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const fs = require('fs');
var bodyParser = require('body-parser')

// Load the SDK for JavaScript
var AWS = require('aws-sdk');



// Then these two lines after you initialise your express app 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// The extensions 'html' allows us to serve file without adding .html at the end 
// i.e /my-cv will server /my-cv.html


app.use(express.static("public", {'extensions': ['html']}));

app.get('/', function (req, res) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "cyf-yfekadu-posts",
        ProjectionExpression: "title, summary, content",
    };

    console.log("Scanning posts table.");
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the posts
            console.log("Scan succeeded.");
            data.Items.forEach(function(post) {
            console.log(
                    post.title + ": ",
                    post.summary, "- content:", post.content);
            });

            res.render('index', {
                title: "yohannes's profile",
                subheading: "A modern Website built in Node with Handlebars",
                posts: data.Items
            });
        }
    }
});

app.post('/admin', function (req, res) {

    // Create the DynamoDB service object
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: 'cyf-yfekadu-posts',
        Item:{
            'title' : req.body.title,
            'summary' : req.body.summary,
            'content' : req.body.contents,
        }
    };

    // Call DynamoDB to add the item to the table
    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
res.end();
});

app.get('/api/posts', function (req, res) {
    const filePath = __dirname + '/data/posts.json';
    
    var options = {
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };

    res.sendFile(filePath, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', filePath);
      }
    });
});

app.get('/my-cv', function (req, res) {
    res.render('my-cv');
});

app.get('/admin', function (req, res) {
    res.render('admin');
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

// what does this line mean: process.env.PORT || 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});