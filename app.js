var express = require('express'),
    words = require('./routes/words'),
    config = require('./config/common');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.use(express.cookieParser("here is my secret"));
	app.use(express.session());
});

//REST Routes
app.set('views', __dirname + '/views');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.engine('html', require('ejs').renderFile);

app.get('/words', words.findAll);
app.get('/words/:id', words.findById);
app.get('/words/definitions/:word', words.getWordData);

app.post('/words', words.addWord);
app.get('/home', function (req, res)
{
    res.render('index.html');
});

app.listen(3000);
console.log('Listening on port 3000...');