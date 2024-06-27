const express = require('express');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model('Post', postSchema);

app.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home', {
      posts: posts,
    });
  });
});

app.get('/compose', function (req, res) {
  res.render('compose');
});

app.post('/compose', function (req, res) {
  const post = new Post({

    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/contact', function (req, res) {
  res.render('contact');
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port : http://localhost:3000');
});
