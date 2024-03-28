const md5 = require('md5');
const Account = require("../../model/accounts.model");
const Role = require("../../model/role.model");

const generateHelper = require("../../helpers/generate.helper");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  const records = await Account.find(find);

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id
    });
    record.role = role;
  }
  
  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });

};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

  req.body.token = generateHelper.generateRandomString(30);
  req.body.password = md5(req.body.password);

  const record = new Account(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.edit = async (req, res) => {
  try {
    const data = await Account.findOne({
      _id: req.params.id,
      deleted: false
    });

    const roles = await Role.find({
      deleted: false,
    });


    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(req.body.password){
    req.body.password = md5(req.body.password);
  }else{
    delete req.bpdy.password;
  }

  await Account.updateOne({
    _id: id
  }, req.body);

  req.flash("success", "Cập nhật thành công");

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};