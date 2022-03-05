//jshint esversion:6

const express = require("express");
const url = require('url');
const lodash = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const postList = [] ;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB').catch(err=> {
  if (err)
  console.log(err);
});

const blogItemSchema = mongoose.Schema({
  title : String,
  content : String
});

const blogItem = mongoose.model("blogItem" , blogItemSchema);

app.get("/" , (req,res)=>{
  blogItem.find({}, (err, foundBlogPosts) => {
    if (!err){
      console.log(foundBlogPosts);
      let data={
        homeStartingContent : homeStartingContent,
        postList : foundBlogPosts,
      };
      res.render("home",data);
    }

  });

});


app.get("/about" , (req,res)=>{
  let data={
    aboutContent : aboutContent
  };
  res.render("about",data);
});


app.get("/contact" , (req,res)=>{
  let data={
    contactContent : contactContent
  };
  res.render("contact",data);
});


app.get("/compose" , (req,res)=> {
  res.render("compose");
});

app.post("/compose" , (req,res)=> {
  let tempBlogItem = new blogItem ({title: req.body.comTitle, content : req.body.comContent});
  // postList.push({title: req.body.comTitle, content : req.body.comContent});
  // console.log(postList);
  tempBlogItem.save().then(() => console.log("added new blog post"));
  res.render("compose");
});


app.get("/posts/:id" , (req,res)=> {
  // let currTitle = new URL(req.headers.host + req.originalUrl).searchParams.get('title'); // url /post?title=xyz
  let currId = req.params.id;
  // let result = getPostByTitle(currTitle);

  // if (result === 1 )
  //   result = {title : "ERORR : Post not found", content : "Something went wrong while fetching this post, please try again!"};
  //
  // let data={
  //   title : result.title,
  //   content : result.content
  // };
  // res.render("post", data);

  blogItem.findOne({_id : currId}, (err, foundBlogPost) => {
    let data ;
    if (!err){
      console.log(foundBlogPost);
      data = {
        title : foundBlogPost.title,
        content : foundBlogPost.content,
      };
    }
    else {
      data  = {title : "ERORR : Post not found", content : "Something went wrong while fetching this post, please try again!"}
    }
    res.render("post", data);
  });




});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});


const getPostByTitle = (key) => {
  for (let i = 0 ; i < postList.length ; i++){
    if (lodash.lowerCase(postList[i].title) === lodash.lowerCase(key)){
      return postList[i];
    }
  }
  return 1 ;
  // postList.forEach(function (post) {
  //   console.log(post.title);
  //   console.log(key);
  //   if (post.title === key){
  //     console.log("match!");
  //     return post;
  //   }
  //   console.log(" NOT match!");
  //
  // });

}
