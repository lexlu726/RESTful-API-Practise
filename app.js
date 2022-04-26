const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();





app.set('view engine',"ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');
const articlesSchema = new mongoose.Schema({
  title: String,
  content:String
});
const Article = mongoose.model("Article",articlesSchema);
////////////////////////////////////Request Targeting All Articles/////////////
app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundarticles){
    if (!err){
      res.send(foundarticles);
    } else {
      res.send(err);
    }

  });
})

.post(function(req, res){
  const newArticle = new Article({
    title:req.body.title ,
    content:req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article")
    } else {
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully delete everything")
    } else{
      res.send(err)
    }
  });
});
////////////////////////Requests Targeting a Specific Article//////
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if (foundArticle){
      res.send(foundArticle)
    } else{
      res.send("No article was found ")
    }
  })
})

.put(function(req,res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully send new article ")
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.")
      } else {
        res.send(err)
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
    if (!err){
      res.send("Successfully deleted the corresponding article.")
    } else {
      res.send(err)
    }
  })
});





app.listen(3000,function(req,res){
  console.log("Server is on run!")
});
