var mongo  = require('mongodb'),
    config = require('../config/common')
    ;

// Wordnik API setup
var Wordnik = require('wordnik');
var wn = new Wordnik({
    api_key: config.wordnik.key
});

// Simple MongoDB Server Setup
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('wordsdb', server);

// Connect to database
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'words' database");
        db.collection('words', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'words' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});


/**
* RESTful API Definitions
* findById    = Gets a user's word based on the ID of the word
* findALL     = Gets all the users words with associated word data
* addWord     = Adds
* getWordData = Given a specified word, returns word definitions from Wordnik
*/
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving word: ' + id);
    db.collection('words', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('words', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(items);
        });
    });
};

exports.addWord = function(req, res) {
    var word = req.body;
    word.date = {date: new Date()};

    console.log('Adding word: ' + JSON.stringify(word));

    db.collection('words', function(err, collection) {
        collection.insert(word, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.getWordData = function(req, res) {
    console.log("Getting Word Data for " + req.params.word);

    var word = req.params.word.toLowerCase();
 
    wn.definitions(word, function(e, defs) {
      res.send(defs);
    });
}


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var words = [
    {
       word: "Spencer",
       definition: "A genius"
    },
    {
       word: "Didactic",
       definition: "So very moralizing"
    }];

    db.collection('words', function(err, collection) {
        collection.insert(words, {safe:true}, function(err, result) {});
    });

};