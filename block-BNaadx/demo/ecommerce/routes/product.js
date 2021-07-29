var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Comment = require('../models/comments');
/* GET users listing. */

router.get('/', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('productsPage', { products: products });
  });
});
router.get('/adminOptions', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('adminProductsPage', { products: products });
  });
});
router.get('/userOptions', function (req, res, next) {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    res.render('usersProductsPage', { products: products });
  });
});
router.get('/new', function (req, res) {
  res.render('productsForm');
});
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id;
//   product.findById(id, (err, product) => {
//     if (err) return next(err);
//     res.render('singleUser', { product: product });
//   });
// });
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id;
//   product.findById(id, (err, product) => {
//     if (err) return next(err);
//     Comment.find({ productId: id }, (err, comment) => {
//       if (err) return next(err);
//       res.render('singleUser', { product: product, comment: comment });
//     });
//   });
// });
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id)
    .populate('comments')
    .exec((err, product) => {
      if (err) return next(err);
      res.render('singleUser', { product: product });
    });
});

router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render('productNewForm', { product: product });
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    Comment.deleteMany({ productId: product.id }, (err, info) => {
      res.redirect('/product');
    });
  });
});
var cart = [];
router.get('/:id/addToCart', function (req, res, next) {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    cart.push(product);
    res.render('cart', { cart: cart });
  });
});

router.post('/adminOptions', (req, res, next) => {
  Product.create(req.body, (err, createArticle) => {
    if (err) return next(err);
    res.redirect('/product');
  });
});
router.post('/:id/updateForm', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updateproduct) => {
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});
router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  req.body.productId = id;
  Comment.create(req.body, (err, comment) => {
    Product.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedproduct) => {
        console.log(err, comment);
        if (err) return next(err);
        res.redirect('/product/' + id);
      }
    );
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, product) => {
    console.log(err, product);
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, product) => {
    console.log(err, product);
    if (err) return next(err);
    res.redirect('/product/' + id);
  });
});
module.exports = router;
