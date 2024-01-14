const express = require("express");
const route = express.Router();
const multer = require('multer');

const multerStorage = require("../../helpers/storage-multer.helper");

const validate = require("../../validate/admin/product.validate");

const upload = multer({storage: multerStorage()});

const controller = require("../../controllers/admin/products.controller");

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
    validate.createPost,
    controller.createPost
);

route.get("/edit/:id", controller.edit);

route.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    validate.createPost,
    controller.editPatch
)

route.get("/detail/:id", controller.detail);

module.exports = route;