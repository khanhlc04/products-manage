const Product = require("../../model/product.model");
const filterStateHelper = require("../../helpers/filterState.helper");
const keywordHelper = require("../../helpers/keyword.helper");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination.helper");

module.exports.index = async (req, res) =>{
    try {
        const filterState = filterStateHelper(req.query);
        const find = {
            deleted: false,
        }
    
        if(req.query.status){
            find.status = req.query.status;
        }
    
        if(req.query.keyword){
            find.title = keywordHelper(req.query);
        }
    
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
    
        const products = await Product.find(find)
            .sort({
                position: "desc"
            })
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);
    
        res.render("admin/pages/products/index", {
            pageTitle: "Trang sản phẩm",
            Products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.changeStatus = async (req, res) =>{
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status,
    });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch(type){
        case "active":
        case "inactive":
            await Product.updateMany({
                _id : {$in: ids}
            }, {
                status: type
            })
            break;
        case "delete-all":
            await Product.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position); 

                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            break;
        default: break;
    }

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deleteAt: new Date()
    });

    req.flash('success', 'Xóa sản phẩm thành công!');

    res.redirect("back");
}

module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }

    if(req.file && req.file.filename){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);

    await product.save();

    req.flash("success", "Thêm mới sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async(req, res) => {
    try{
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        })

        res.render("admin/pages/products/edit",{
        pageTile: "Chỉnh sửa sản phẩm" ,
        product: product
        })
    }catch(error){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.editPatch = async (req, res) => {
    try{
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
    
        if(req.file && req.file.filename){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
    
        await Product.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        
        const product = new Product(req.body);
    
        await product.save();
    
        req.flash("success", "Sửa thông tin sản phẩm thành công!");
    
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }catch(error){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.detail = async(req, res) => {
    try{
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        })

        res.render("admin/pages/products/detail",{
        pageTile: "Chi tiết" ,
        product: product
        })
    }catch(error){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}