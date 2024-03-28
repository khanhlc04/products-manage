const ProductCategory = require("../../model/product-category.model");
const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/create-tree.helper");

module.exports.index = async (req, res) => {
    const productCategory = await ProductCategory.find({
        deleted: false
    })

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: productCategory
    });
}

module.exports.create = async (req, res) => {
    const productCategory = await ProductCategory.find({
        deleted: false,
    });

   
    const newRecords = createTreeHelper(productCategory);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords
    });
}

module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const productCategory = new ProductCategory(req.body);

    await productCategory.save();

    req.flash("success", "Thêm mới sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}

module.exports.edit = async (req, res) => {
    try {
      const data = await ProductCategory.findOne({
        _id: req.params.id,
        deleted: false
      });
  
      const records = await ProductCategory.find({
        deleted: false,
      });
  
      const newRecords = createTreeHelper(records);
  
      res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        data: data,
        records: newRecords
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
  };

  module.exports.editPatch = async (req, res) => {
    try {
      if(req.body.position == "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }
  
      await ProductCategory.updateOne({
        _id: req.params.id,
        deleted: false
      }, req.body);
  
      req.flash("success", "Cập nhật danh mục sản phẩm thành công!");
  
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne({
    _id: id
  },{
    deleted: true,
    deletedAt: new Date()
  })

  req.flash('success', 'Xóa sản phẩm thành công!');

  res.redirect("back");
}

module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  
  await ProductCategory.updateOne({
    _id: id
  }, {
      status: status,
  });

  req.flash('success', 'Cập nhật trạng thái thành công!');

  res.redirect("back");
}