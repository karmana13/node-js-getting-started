const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
module.exports = router;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

router.get('/mongodb', function (req, res, next) {
    MongoClient.connect("mongodb://karmana:Heroku-karmana1@ds229088.mlab.com:29088/heroku_nb76xh5b", function(err, myClient) {
        if(err) throw err;
        //get collection of routes
        const randomDatabase = myClient.db('heroku_nb76xh5b');
        var Routes = randomDatabase.collection('Routes');
        //get all Routes with frequency >=1
        Routes.find({ frequency : { $gte: 0 } }).sort({ name: 1 }).toArray(function (err, docs) {
            if(err) throw err;

            res.render('pages/mongodb', {results: docs});

        });

        //close connection when your app is terminating.
        myClient.close(function (err) {
            if(err) throw err;
        });
    });//end of connect
});//end app.get


