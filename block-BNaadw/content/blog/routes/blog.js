var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var Comment = require('../models/comments');
/* GET users listing. */

router.get('/', function (req, res, next) {
  Blog.find({}, (err, blogs) => {
    if (err) return next(err);
    res.render('blogsPage', { blogs: blogs });
  });
});
router.get('/new', function (req, res) {
  res.render('blogsForm');
});
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id;
//   Blog.findById(id, (err, blog) => {
//     if (err) return next(err);
//     res.render('singleUser', { blog: blog });
//   });
// });
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id;
//   Blog.findById(id, (err, blog) => {
//     if (err) return next(err);
//     Comment.find({ blogId: id }, (err, comment) => {
//       if (err) return next(err);
//       res.render('singleUser', { blog: blog, comment: comment });
//     });
//   });
// });
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id)
    .populate('comments')
    .exec((err, blog) => {
      if (err) return next(err);
      res.render('singleUser', { blog: blog });
    });
});

router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id, (err, blog) => {
    if (err) return next(err);
    res.render('blogNewForm', { blog: blog });
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndDelete(id, (err, blog) => {
    if (err) return next(err);
    Comment.deleteMany({ blogId: blog.id }, (err, info) => {
      res.redirect('/blog');
    });
  });
});

router.post('/', (req, res, next) => {
  Blog.create(req.body, (err, createArticle) => {
    if (err) return next(err);
    res.redirect('/blog');
  });
});
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, req.body, (err, updateBlog) => {
    if (err) return next(err);
    res.redirect('/blog/' + id);
  });
});
router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  req.body.blogId = id;
  Comment.create(req.body, (err, comment) => {
    Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedBlog) => {
        console.log(err, comment);
        if (err) return next(err);
        res.redirect('/blog/' + id);
      }
    );
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + id);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + id);
  });
});
module.exports = router;
