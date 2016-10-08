
var flag =false;
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var pmongo = require('promised-mongo').compatible();

const app = express();
var db = pmongo('mydb', ['mycollection']);

var http = require('http');
var restclient = require('node-rest-client').Client;
restclient = new restclient();

MongoClient.connect('mongodb://carolyfisher:2tz87aav@ds153845.mlab.com:53845/friendpoints', function(err, database){
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function(){
    console.log('listening on 3000'); 
  }); 
});

app.set('view engine', 'pug');
app.get('/', function(req, res){
    res.render('index', {button: "Next"});
});
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({extended: true}));

var counter = 0; 
var score= 0; 
app.post('/submit', function(req, res) {
    guess = req.body.guess;
    var tcin = "50220026";
    restclient.get("https://api.target.com/products/v3/" + tcin + "?id_type=tcin&fields=pricing&key=3fa81a61d543037098387d0ba9ce4c36aad4a2e5", function (data, response) {
        name = data.product_composite_response.items[0].general_description;
        imgurl = "http://scene7.targetimg1.com/is/image/Target/" + tcin + "?wid=450&hei=450&fmt=pjpeg";
        price = Math.round(data.product_composite_response.items[0].online_price.current_price);
        res.render('index', {name: name, imgurl: imgurl});
        percent = Math.round( guess/price * 100 * 10) / 10;
        if (counter < 10){
            if (percent > price){
                counter++; 
                console.log(counter);
            } else{
                score += percent; 
                counter++; 
                console.log(counter);
                console.log(score);
            }
        } else{
            res.render('index', {score: score}); 
        }
    });
});
