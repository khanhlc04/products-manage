const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');

module.exports.login = async(req, res) =>{
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập"
    });
}

module.exports.loginPost = async(req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash("error", "Email không tồn tại!");
        res.redirect('back');
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu, vui lòng nhập lại!");
        res.redirect('back');
        return;
    }

    if(user.status == "inactive"){
        req.flash("error", "Tài khoản của bạn đang bị khóa!");
        res.redirect('back');
        return;
    }

    res.cookie("token", user.token);

    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}