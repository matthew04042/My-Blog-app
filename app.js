//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "My first Web app";
const aboutContent = "This is a ejs learning project made by Matthew";
const contactContent = "Email: matthew04042@hotnail.com";

const credentials = __dirname+"/mongodb-admin.cer";

mongoose.connect("mongodb+srv://cluster0.0tx7fav.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority", {
  sslKey: credentials,
  sslCert: credentials
});

const {Schema} = mongoose;

const postSchema = new Schema({
  title: String,
  content: String
});

const Post = mongoose.model('post', postSchema);

const app = express();

var posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find({}, (err, callback)=>{
    if(err){
      console.log(err);
    }else{
      console.log(callback);
      res.render("home",{
        homeContent:homeStartingContent,
        homePost:callback
      });
    }
  })
  // res.render("home", {
  //   homeContent: homeStartingContent,
  //   homePost: posts
  // });
});

app.get("/about", (req, res) => {
  res.render("about", {
    contentOfAbout: aboutContent
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contentofContact: contactContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose", {
    contentofContact: contactContent
  });
});

app.get("/post/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findById({_id:requestedPostId}, (err, postFouned)=>{
    if(!err){
      console.log(postFouned);
      res.render("post", {mPost: postFouned});
    } 
  });
});

app.post("/compose", async(req, res) => {
  let post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  await post.save();
  res.redirect("/")
});



app.listen(3000, () => {
  console.log("Server started on port 3000");
});
