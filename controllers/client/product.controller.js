const Product = require("../../model/product.model");

//[GET] product
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({
    position: "desc"
  });

  for (const item of products) {
    item.newPrice = (item.price * ((100 - item.discountPercentage) / 100)).toFixed(2); 
  }

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
  });
}

module.exports.detail = async (req, res) => {
  try{
    const slug = req.params.slug;

    console.log(slug);

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })
  
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  }catch(error){
    res.redirect("/");
  }
}