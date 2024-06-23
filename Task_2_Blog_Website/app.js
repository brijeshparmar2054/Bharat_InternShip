
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Explore the world of [your blog's niche or focus] with us. Our blog is your go-to resource for [briefly describe what your blog offers - insights, tips, inspiration, etc.]. Whether you're a novice or an expert, we're here to inform and inspire you on [topic].Join our community of [your audience - enthusiasts, learners, professionals, etc.] as we delve into [topic] together. Discover engaging articles, practical advice, and thought-provoking perspectives that will enhance your [topic] journey. Stay updated with our latest posts and exclusive content by subscribing to our newsletter. Start exploring our blog now and let's embark on this enriching journey together!";
const aboutContent = "Welcome to [Your Blog Name], where [briefly describe your blog's mission or purpose]. Whether you're passionate about [your blog's niche or focus], seeking practical advice, or looking for inspiration, you've come to the right place. At [Your Blog Name], we're dedicated to [describe what sets your blog apart - deepening knowledge, fostering community, providing expert insights, etc.]. Our goal is to [mention the primary goal - educate, entertain, inspire, etc.] and empower our readers through well-researched articles, engaging stories, and informative guides. Join us on this journey as we explore the nuances of [your niche/topic] together. Whether you're a curious beginner or a seasoned expert, there's something here for everyone. Our team of passionate writers and contributors are committed to delivering valuable content that enriches your understanding and enhances your experience in [topic]. Thank you for visiting [Your Blog Name]. Explore our latest posts, connect with us on social media, and subscribe to our newsletter for updates straight to your inbox. We look forward to sharing this exciting adventure with you!";
const contactContent = "Have a question, suggestion, or just want to say hello? We'd love to hear from you! Get in touch with us using the contact form below or reach out to us directly at [your email address].Your feedback is valuable to us and helps us improve [Your Blog Name]. Whether you have inquiries about our content, partnership opportunities, or you simply want to share your thoughts, we're here to listen. Thank you for being a part of our community at [Your Blog Name]. We look forward to connecting with you!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/Blog');

const connection=mongoose.connection;

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function (req, res) {
  Post.find({})
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => console.log(err));
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
    .then(() => res.redirect("/"))
    .catch(err => {
      console.log(err);
      res.redirect("/");
    });
});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId }).exec();
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      res.send("Post not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
