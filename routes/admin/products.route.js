const express = require("express");
const route = express.Router();
const multer = require('multer');

const validate = require("../../validate/admin/product.validate");

// const multerStorage = require("../../helpers/storage-multer.helper");

// const upload = multer({storage: multerStorage()});

const upload = multer();

const controller = require("../../controllers/admin/products.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

route.get("/", controller.index);

route.patch(
    "/change-status/:status/:id",
    controller.changeStatus
);

route.patch(
    "/change-multi",
    controller.changeMulti
);

route.delete(
    "/delete/:id",
    controller.deleteItem
);

route.get("/create", controller.create);

route.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);

route.get("/edit/:id", controller.edit);

route.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
)

route.get("/detail/:id", controller.detail);

module.exports = route;