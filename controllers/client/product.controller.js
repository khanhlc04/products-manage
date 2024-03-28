const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");
const slugGenerator = require("mongoose-slug-updater/lib/slug-generator");

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
    const slug = req.params.slugProduct;

    console.log(slug);

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

    product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

    if(product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id
      });

      product.category = category;
    }
  
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  }catch(error){
    res.redirect("/");
  }
}

module.exports.category = async (req,res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false
  });

  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });

    let allSubs = [...subs];

    for(const sub of subs){
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  }

  const allCategory = await getSubCategory(category.id);
  const allCategoryId = allCategory.map(item => item.id);

  const products = await Product.find({
    product_category_id: {
      $in: [
        category.id,
        ...allCategoryId
      ]
    },
    status: "active",
    deleted: false
  }).sort({position: "desc"});

  for (const item of products) {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
  }

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products
  });
}