const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var router = express.Router();
const mongodb = require('mongodb').MongoClient;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/mongodb', function (request, response) {

    mongodb.connect(process.env.MONGODB_URI, function(err, client) {
        if(err) throw err;
        //get collection of routes
        var db = client.db('heroku_nb76xh5b');
        var Routes = db.collection('Routes');
        //get all Routes with frequency >=1
        Routes.find({ frequency : { $gte: 0 } }).sort({ name: 1 }).toArray(function (err, docs) {
            if(err) throw err;

            response.render('pages/mongodb', {results: docs});

        });

        //close connection when your app is terminating.
        client.close(function (err) {
            if(err) throw err;
        })
    })//end of connect
})//end app.get
 
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
