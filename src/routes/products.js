const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { createProduct, getProductsBySlug, getProductDetailsById} = require("../controller/product");
const {upload} = require("../common-middleware/index")
const router = express.Router();


router.post("/product/create", requireSignin, adminMiddleware,upload.array('productPicture') ,createProduct);
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);

module.exports = router;
