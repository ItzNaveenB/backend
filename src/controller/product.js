const Product = require("../models/Product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/Category");

exports.createProduct = (req, res) => {
  // res.status(200).json({file:req.files,body:req.body})

  req.body.createdBy = req.user._id;

  const { name, price, description, category, createdBy, quantity } = req.body;
  const files = req.files;

  let productPictures = [];

  if (files && files.length > 0) {
    productPictures = files.map((file) => {

      return { img: `${process.env.API}/public/${file.filename}` };
    });
  }
  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    quantity,
    productPictures,
    category,
    createdBy,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      return res.status(201).json({ product });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (products.length > 0) {
            res.status(200).json({
              products,
              productsByPrice: {
                under5k: products.filter((product) => product.price <= 5000),
                under10k: products.filter(
                  (product) => product.price > 5000 && product.price <= 10000
                ),
                under15k: products.filter(
                  (product) => product.price > 10000 && product.price <= 15000
                ),
                under20k: products.filter(
                  (product) => product.price > 15000 && product.price <= 20000
                ),
                under30k: products.filter(
                  (product) => product.price > 20000 && product.price <= 30000
                ),
              },
            });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
