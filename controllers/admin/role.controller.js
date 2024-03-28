const Role = require("../../model/role.model");
const systemConfig = require("../../config/system");
const { updateOne } = require("../../model/product.model");

module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    })

    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Thêm mới nhóm quyền"
    })
}

module.exports.createPost = async (req, res) => {
    console.log(req.body);
    const record = new Role(req.body);
    await record.save();

    req.flash("Thêm mới thành công!")

    res.redirect(`/${systemConfig.prefixAdmin}/role`)
}

module.exports.edit = async (req, res) => {
    try {
        const record = await Role.find({
            _id: req.params.id,
            deleted: false
        })

        res.render("admin/pages/role/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/role`)
    }
}

module.exports.editPatch = async (req, res) => {
    await Role.updateOne({
        _id: req.params.id,
        deleted: false
    },req.body)

    req.flash("Cập nhật thành công!")

    res.redirect(`back`);
}

module.exports.permission = async (req, res) => {
    const records = await Role.find({
        deleted: false
      });
    
      res.render("admin/pages/role/permission", {
        pageTitle: "Phân quyền",
        records: records
      });
}

module.exports.permissionPatch = async (req, res) => {
    const roles = JSON.parse(req.body.roles);

    try{
        for (const item of roles){
            await Role.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            })
        }
        req.flash("success", "Cập nhật phân quyền thành công!");
    } catch(error) {
        req.flass("success", "Cập nhật phân quyền thất bại!")
    }

    res.redirect('back');
}