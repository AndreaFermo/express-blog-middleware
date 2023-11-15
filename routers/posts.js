const express = require("express");
const multer = require("multer");
const router = express.Router();
const postsController = require("../controllers/posts");

router.get("/", postsController.index);

router.get("/create", postsController.create);

router.get("/:slug", postsController.show);

router.post("/", multer({ dest: "public/imgs/posts" }).single("image"), postsController.store);

router.delete("/:slug", postsController.destroy)

router.get("/:slug/download", postsController.downloadImage);

router.get("/:slug/image", postsController.showImage);


module.exports = router;