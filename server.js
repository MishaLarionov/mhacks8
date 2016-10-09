
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

var http = require('http');
var restclient = require('node-rest-client').Client;
restclient = new restclient();

MongoClient.connect('mongodb://carolyfisher:2tz87aav@ds153845.mlab.com:53845/friendpoints', function(err, database){
  if (err) return console.log(err);
  db = database;
  app.listen(80, function(){
    console.log('listening on 80');
  });
});

var counter = 0;
var score= 0;
 var codes = ["50277815", "16947494", "16947221", "50220026", "15290541", "10805587", "538637", "16945587", "14510593", "51118013", "93505", "16346820", "50679552", "15600111", "51242317", "51372132", "16797418", "51372269", "51237142", "49163945", "16772758", "17294692", "50076491", "21500107", "51204503", "46790692", "13066108", "50225542", "51324416", "50487110", "50730385", "15324510", "17078499", "50867137", "47114331", "16851781", "50887044", "13304816"];
app.set('view engine', 'pug');
app.get('/', function(req, res){
    if (counter > 10){
      counter = 0;
      res.render('results', {score: score});
      points = 0;
      score = 0;
    }
    counter++;
    console.log(counter);
    var tcin = codes[Math.floor(Math.random() * codes.length)];
    restclient.get("https://api.target.com/products/v3/" + tcin + "?id_type=tcin&fields=pricing&key=3fa81a61d543037098387d0ba9ce4c36aad4a2e5", function (data, response) {
        var name = data.product_composite_response.items[0].general_description;
        var imgurl = "http://scene7.targetimg1.com/is/image/Target/" + tcin + "?wid=450&hei=450&fmt=pjpeg";
        var price = Math.round(data.product_composite_response.items[0].online_price.current_price);
        res.render('index', {name: name, imgurl: imgurl, price: price, action: "submit", disabled: false});
    });
});
app.post('/', function(req, res){
    counter++;
    console.log(counter);
    var tcin = codes[Math.floor(Math.random() * codes.length)];
    restclient.get("https://api.target.com/products/v3/" + tcin + "?id_type=tcin&fields=pricing&key=3fa81a61d543037098387d0ba9ce4c36aad4a2e5", function (data, response) {
        var name = data.product_composite_response.items[0].general_description;
        var imgurl = "http://scene7.targetimg1.com/is/image/Target/" + tcin + "?wid=450&hei=450&fmt=pjpeg";
        var price = Math.round(data.product_composite_response.items[0].online_price.current_price);
        res.render('index', {name: name, imgurl: imgurl, price: price, action: "submit", disabled: false});
    });
});
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({extended: true}));

app.post('/submit', function(req, res) {
    guess = parseInt(req.body.guess);
    price = parseInt(req.body.price);
    imgurl = req.body.imgurl;
    if (guess > price){
        points = 0;
    } else {
        points = Math.round( guess/price * 100);
        score += points;
    }
    if (counter < 10){
        var results = "You guessed " + guess + ", the price was " + price + " and you earned " + points + " points for a total of " + score;
        res.render('index', {name: "", results: results, imgurl: imgurl, action: "/", disabled: true});
    } else {
      counter = 0;
      res.render('results', {score: score});
      points = 0;
      score = 0;
    }
});
