const mongoose = require('mongoose');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articleSchema);

app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully saved to database');
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully deleted all articles');
      }
    });
  });

//  Route for specific article
app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (err) {
        res.send(err);
      } else {
        res.send(article);
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send('Successfully updated article');
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body }, (err) => {
      if (!err) {
        res.send('Successfully updated article');
      }
    });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send('Successfully deleted article');
      }
    });
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
