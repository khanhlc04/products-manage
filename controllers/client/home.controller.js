const Product = require("../../model/product.model");

module.exports.index = async (req, res) =>{
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6);

    
  for (const item of productsFeatured) {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
  }

  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" }).limit(6);

  for (const item of productsNew) {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
  }

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured,
        productsNew: productsNew
    });
}