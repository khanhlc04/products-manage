const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const controller = require("../../controllers/admin/products-category.controller");

const validate = require("../../validate/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
);

router.patch(
    "/change-status/:status/:id",
    controller.changeStatus
)

router.delete(
    "/delete/:id",
    controller.delete
)

module.exports = router;